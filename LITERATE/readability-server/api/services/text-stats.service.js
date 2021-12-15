(function () {

	'use strict';

	class TextStats {

		constructor() {

		}

		sentenceCount(text) {
			return getSentenceCount(text);
		}

		syllableCount(text) {
			return getSyllableCount(text);
		}

		textStats(text) {
			return getTextStats(text);
		}

		wordCount(text) {
			return getWordCount(text);
		}

		charCount(text) {
			return getCharCount(text);
		}

		complexCount(text) {
			return getComplexWordCount(text);
		}

		simpleCount(text) {
			return getSimpleWordCount(text);
		}

		daleCount(text) {
			return getDaleCount(text);
		}

		spacheCount(text) {
			return getSpacheCount(text);
		}

		tfidf(text) {
			return tfidf(text);
		}
	}

	/**
	 * Counts the number of sentences in a body of text.
	 * @param  {string} text - a body of text
	 * @return {int} number of sentences in the text
	 */
	function getSentenceCount(text) {
		if(text == null)
			return 0;
		var sentences = text.split(/[.!:;?]/);
	    var sentenceCounter = sentences.length;
	    for (var i = 0; i < sentences.length; i++) {
	    	if(invalidSentence(sentences[i]))
	    		sentenceCounter--;
	    }
	    return sentenceCounter;
	}

	/**
	 * Sums the number of syllables for each word
	 * in a body of text.
	 * @param  {string} text - a body of text
	 * @return {int} total number of syllables in text
	 */
	function getSyllableCount(text) {
		if(text == null)
			return 0;
		let count = totalSyllables(removePunctuation(text));
		return count.totalSyllables;
	}

	/**
	 * Returns an object containing stats for a body
	 * of text. This includes number of words,
	 * sentences, and syllables.
	 * @param  {string} text - a body of text
	 * @return {object} text stats
	 */
	function getTextStats(text) {
		let textStats = {
			numWords: getWordCount(text),
			numSentences: getSentenceCount(text),
			numSyllables: getSyllableCount(text),
			numCharacters: getCharCount(text),
			numComplexWords: getComplexWordCount(text),
			numDaleWords: getDaleCount(text),
			numSpacheWords: getSpacheCount(text),
			monoSylls: getSimpleWordCount(text),
			keywords: tfidf(text)
		};
    return textStats;
	}

	/**
	 * Counts the number of words in a body of text.
	 * @param  {string} text - a body of text
	 * @return {int} number of words in the text
	 */
	function getWordCount(text) {
    let noPunctuation = removePunctuation(text);
    let words = noPunctuation.split(' ');
    return words.length;
	}

	/**
	* Counts the number of word characters in a body of text.
	*/
	function getCharCount(text) {
		let noPuncts = removePunctuation(text);
		let noSpaces = noPuncts.replace(/[^\w]/g, '');
		return noSpaces.length;
	}

	/**
	* Counts the number of words with 3 or more syllables,
	* used in several readability formulas.
	*/
	function getComplexWordCount(text) {
		let syllableCounts = totalSyllables(text);
		return syllableCounts.complexWords;
	}

	/**
	 * Counts the number of single-syllable words.
	 */
	function getSimpleWordCount(text) {
		let monoSyllables = totalSyllables(text);
		return monoSyllables.monoSylls;
	}

	/**
	* Counts the number of words appearing on Dale-Chall word list.
	* The # of 'familiar' words.
	*/
	function getDaleCount(text) {
		let daleCount = 0;

		var daleWords = require('../services/daleWords');
		var daleTable = daleWords.getDale();
		var article = text.split(' ');

		for (let word of article) {
			if (word in daleTable) {
				daleCount++;
			}
		}
		return daleCount;
	}

	/**
	* Counts the number of words appearing on Revised Spache word list.
	* The # of 'familiar' words.
	*/
	function getSpacheCount(text) {
		let spacheCount = 0;

		var spacheWords = require('../services/spacheWords');
		var spacheTable = spacheWords.getSpache();
		var article = text.split(' ');

		for (let word of article) {
			if (word in spacheTable) {
				spacheCount++;
			}
		}
		return spacheCount;
	}


	/**
	 * return hashmap of words & scores
	 */
	function tfidf(text) {

		// remove html
		text = text.replace(/([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/, '');

		// remove punctuation
		text = text.replace(/[^\w\s]/g, ' ');

		// remove numbers, embedded digits
		text = text.replace(/[\d]/g, '');

		// remove '\n'
		text = text.replace(/[\\\n]/g, '');

		// remove stop words
		var stopWords = require('../services/stopwords');
		var stopTable = stopWords.getStop();
		var article = text.split(' ');

		// remove names
		var names = require('../services/totalnames');
		var nameTable = names.getNames();

		// find tf
		var tfs = new Object();
		var mostFrequent = 1.0;
		for (let w of article) {
			if (w in nameTable) { continue; }
		// make lower case
			w = w.toLowerCase();
			if (w in stopTable) { continue; }
			// build term frequency table for article
			if (!tfs.hasOwnProperty(w)) {
				tfs[w] = 1.0;
			} else {
				tfs[w] = tfs[w] + 1.0;
				if (tfs[w] > mostFrequent) {
					mostFrequent = tfs[w];
				}
			}
		}
		// normalize tf scores
		for (var t in tfs) {
			var te = tfs[t];
			tfs[t] = te / mostFrequent;
		}

		var idfScores = require('../services/idfscores');
		var idfTable = idfScores.getIdf();
		var totalDocs = idfTable.Corpus_Size;

		var tfIdfs = new Object();
		// Calculate tfidf scores
		for (var t in tfs) {
			var idf = 0;
			if (idfTable.hasOwnProperty(t)) {
				idf = idfTable[t];
			} else {
				idf = Math.log((totalDocs + 1) / 1.0);
			}
			var tf = tfs[t];
			var tfidf = idf * tf;
			tfIdfs[t] = tfidf;
		}
//console.log(tfIdfs);

		//sort scores into ascending order
    		var sortedScores = [];
		for (var term in tfIdfs) {
			sortedScores.push([term, tfIdfs[term]]);
		}
		sortedScores.sort(function(a, b) {
			return b[1] - a[1];
		});

	// return table of tfidf scores to terms occurring in article
	//console.log("here");
	//console.log(sortedScores[0], sortedScores[1], sortedScores[2]);
	return sortedScores;
	}

	/*-- Helper Functions --*/

	/**
	 * Returns an array of the words in a body of text.
	 * @param  {string} text - a body of text
	 * @return {string array} an array of words
	 */
	function removePunctuation(text) {
		if(text == null)
			return [];
		let noPunctuation = text.replace(/[^\w\s]/g, '');
		return noPunctuation;
	}

	/**
	 * Checks if a sentence is invalid.
	 * @param  {string} sentence - a sentence
	 * @return {Boolean} true, if invalid, false otherwise
	 */
	function invalidSentence(sentence) {
		const invalidEndings = [
			'Mr', 'Mrs', 'Ms', 'Sr', 'Jr', 'Dr', 'Prof'
		];
		invalidEndings.forEach(ending => {
			if(sentence.endsWith(ending))
				return true;
		});
		return false;
	}

	/**
	 * Checks if a character is a vowel.
	 * @param  {char}  character - a character
	 * @return {Boolean} true, if a vowel, false otherwise
	 */
	function isVowel(character) {
		const vowels = "aeiouy";
		return vowels.indexOf(character) !== -1;
	}

	/**
	 * Counts the number of syllables in the text.
	 * @param  {string} noPunctuation - article text with punctuation removed
	 * @return {int} total number of syllables, total number of complex words
	 */
	function totalSyllables(noPunctuation) {
    var totalSyllables = 0;
    var syllableCounter = 0;
    var wordLength = 0;
		// words w/1 syllable, used in FORCAST
	  var monoSylls = 0;
		// words w/3 or more syllables, used in several formulae
	  var complexWords = 0;

    for (var i = 0; i < noPunctuation.length; i++) {

      var prev = i - 1;
      var next = i + 1;
      var last = i + 2;

      var currChar = noPunctuation.charAt(i);
      var nextChar = 0;
      var prevChar = 0;
      var lastChar = 0;

      // null checks
      if (next < noPunctuation.length) {
        nextChar = noPunctuation.charAt(i+1);
      }
      if (prev >= 0) {
        prevChar = noPunctuation.charAt(i-1);
      }
      if (last < noPunctuation.length-1) {
        lastChar = noPunctuation.charAt(i+2);
      }

      if (currChar === ' ') {
        if (wordLength <= 3) {
          totalSyllables += 1;
        } else {
          totalSyllables += syllableCounter;
        }
        wordLength = 0;

			  if (syllableCounter >= 3) {
			  	complexWords++;
			  } else if (syllableCounter == 1) {
					monoSylls++;
			  }

        syllableCounter = 0;
      } else {
        wordLength++;
        // count a vowel, OR end of consecutive vowels
        if (isVowel(currChar) && !isVowel(nextChar)) {
          // ignore -es and -ed endings
          if (currChar === 'e' && ((nextChar === 's' || nextChar === 'd') && lastChar === ' ')) {
            continue;
          } else if (currChar === 'e' && nextChar === ' ') {
            // ignore -e endings; count -le endings
            if (prevChar === 'l') {
              syllableCounter++;
            }
            continue;
          } else if (currChar === 'y' && prevChar === ' ') { // ignore y- beginnings
            continue;
          } else {
            syllableCounter++;
          }
        }
      }
    }
    let syllableCounts = { totalSyllables, complexWords, monoSylls }
    return syllableCounts;
	}

	/*-- /Helper Functions --*/

	module.exports = TextStats;

}) ();
