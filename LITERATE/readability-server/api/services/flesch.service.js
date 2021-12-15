(function () {

	'use strict';

	const TextStats = require('../services/text-stats.service');
	const textStats = new TextStats();

	class Flesch {

		constructor() {

		}

		flesch(text) {
	    return fleschEase(text);
		}

		keywords(text) {
			return keywords(text);
		}

	}

	/**
	 * Calculates the Flesch Reading Ease score and
	 * returns the score along with the estimated
	 * education level of the text.
	 * @param  {string} text - a body of text to be analyzed
	 * @return {Object} results - contains grade level and score
	 */
	function fleschEase(text) {
		let rE = 0.0;
		let textData = textStats.textStats(text);
		let avgSPW = textData.numSyllables/textData.numWords;
		let avgSL = textData.numWords/textData.numSentences;
    rE = 206.835 - (1.015 * avgSL) - (84.6 * avgSPW);
		let score = rE.toFixed(2);

		let results = {
			educationLevel: fleschEaseEducationLevel(score),
			score: score
		}
		return results;
	}

	/**
	 * Returns a JSON representation of the
	 * education level estimated by the
	 * flesch reading ease score.
	 * The 'low' and 'high' values are for
	 * filtering on the client-side.
	 * @param  {int} score - flesch reading ease score
	 * @return {Object}
	 */
	function fleschEaseEducationLevel(score) {
		switch(true) {
			case (score > 90):
				return { text: "5th grade", value: {low: 5, high: 5} }; //5 - 0
			case (score > 80):
				return { text: "6th grade", value: {low: 6, high: 6} }; //6-5
			case (score > 70):
				return { text: "7th grade", value: {low: 7, high: 7} }; //7-6
			case (score > 60):
				return { text: "8th - 9th grade", value: {low: 8, high: 9} }; //9-7
			case (score > 50):
				return { text: "10th - 12th grade", value: {low: 10, high: 12} };//12-10
			case (score > 30):
				return { text: "College student", value: {low: 13, high: 13} };//15-13
			default:
				return { text: "College graduate", value: {low: 14, high: 14} }; //inf - 16
		}
	}

	/*-- UNUSED FUNCTIONS --*/

	/**
	* Calculate averages to be used by grade level estimates.
	*/
	function getAverages(text) {

		let avgSL = 0.0;
		let avgSPW = 0.0;
		let avgCPW = 0.0;
		let avgComplexPW = 0.0;

		let textData = textStats.textStats(text);

		let numSyllables = textData.numSyllables;
		let numWords = textData.numWords;
		let numSentences = textData.numSentences;
		let numCharacters = textData.numCharacters;
		let numComplexWords = textData.numComplexWords;
		let monoSylls = textData.monoSylls;

		let numDaleWords = textData.numDaleWords;
		let numSpacheWords = textData.numSpacheWords;

		let tfidf = textData.keywords;

		avgSPW = numSyllables / numWords;
		avgSL = numWords / numSentences;
		avgCPW = numCharacters / numWords;
		avgComplexPW = numComplexWords / numWords;

		let averages = {
			avgSPW,
			avgSL,
			avgComplexPW,
			avgCPW,
			numSentences,
			numComplexWords,
			numDaleWords,
			numSpacheWords,
			numSyllables,
			monoSylls,
			tfidf
		};
		return averages;
	}

	/**
	 * This calculates the top 3 keywords
	 */
	function keywords(text) {
		let averageCall = getAverages(text);
		let tfidf = averageCall.tfidf;
		//gets the column which contains the word without its frequency
		var column = tfidf.map(function(value,index) { return value[0] });
		var keywords = column.slice(0,3).join(", ");
		console.log(keywords)

		return keywords
	}

	/**
	* SMOG grade level estimate.
	* 4th grade to college level. Generally ~2 grades higher than Dale-Chall.
	* gives grade level. [skews high]
	*/
	function smog(text) {
		let smog = 0.0;
		let avgNums = getAverages(text);

		let polysyllables = avgNums.numComplexWords;
		let sentences = avgNums.numSentences;

		smog = Math.sqrt(polysyllables * (30/sentences)) + 3.1291;

		return smog;
	}

	/**
	* ARI grade level estimate. Gives grade level.
	*/
	function ari(text) {
		let ari = 0.0;
		let avgNums = getAverages(text);

		let avgCPW = avgNums.avgCPW;
		let avgSL = avgNums.avgSL;

		ari = (4.71 * avgCPW) + (0.5 * avgSL) - 21.43;

		return Math.ceil(ari);
	}

	/**
	* Gunning Fog grade level estimate. Gives grade level. [skews high]
	*/
	function gunning(text) {
		let gunning = 0.0;
		let avgNums = getAverages(text);

		let avgComplexPW = avgNums.avgComplexPW;
		let avgSL = avgNums.avgSL;

		gunning = 0.4 * (avgSL + 100 * avgComplexPW);

		return gunning;
	}

	/**
	* Dale-Chall grade level estimate, 4th grade and above.
	*/
	function dale(text) {
		let dale = 0.0;
		let avgNums = getAverages(text);

		let avgSL = avgNums.avgSL;
		let numWords = avgSL * avgNums.numSentences;
		let difficultWords = numWords - avgNums.numDaleWords;

		let pdw = (difficultWords / numWords) * 100;

		dale = 0.1579 * pdw + (0.0496 * avgSL)

		if (pdw > 5) {
			dale += 3.6365;
		}
		return dale;
	}

	/**
	* Revised Spache grade level estimate, below 4th grade. Score = grade level.
	*/
	function spache(text) {
		let spache = 0.0;
		let avgNums = getAverages(text);

		let avgSL = avgNums.avgSL;
		let numWords = avgSL * avgNums.numSentences;
		let difficultWords = numWords - avgNums.numSpacheWords;

		let pdw = (difficultWords / numWords) * 100;

		spache = (0.121 * avgSL) + (0.082 * pdw) + 0.659

		return spache;
	}

	function flesch(text) {
		let rE = 0.0;

		let avgNums = getAverages(text);
		let avgSPW = avgNums.avgSPW;
		let avgSL = avgNums.avgSL;

    rE = 206.835 - (1.015 * avgSL) - (84.6 * avgSPW);

		let results = {
			educationLevel: gradeLevelEstimate(text),
			score: rE.toFixed(2)
		}
    return results;
	}

	/**
	 * Calculates Flesch-Kincaid grade level.
	 */
	function fleschGrade(text) {
    let gL = 0.0;

		let avgNums = getAverages(text);
		let avgSPW = avgNums.avgSPW;
		let avgSL = avgNums.avgSL;
    gL = (0.39 * avgSL) + (11.8 * avgSPW) - 15.59;
		if (gL > 16)
		  gL = 16;

	  return gL;
	}

	/**
	* Powers-Sumner Kearl Readability formula. good for 1-4th grades.
	* Recalculated Gunning Fog w/McCall-Crabbs reading lessons.
	*/
	function powers(text) {
		let powers = 0.0;
		let avgNums = getAverages(text);
		let avgSPW = avgNums.avgSPW;
		let avgSL = avgNums.avgSL;

		let ns = (avgSPW * 0.0455) * 100;
		powers = (0.0778 * avgSL) + ns - 2.2029;

		return powers;
	}

	/**
	* Coleman-Liau Index, grade level estimate.
	*/
	function coleman(text) {
		let coleman = 0.0;
		let avgNums = getAverages(text);

		let avgChars = avgNums.avgCPW;
		let avgSL = avgNums.avgSL;

		let sentencesPerWords = 1 / avgSL;

		coleman = 0.0588 * (avgChars * 100) - 0.296 * (sentencesPerWords * 100);

		return coleman;
	}


	/**
	 * Calling this function [gradeRange()] 'flesch()' until other edits
	 */
	function gradeLevelEstimate(text) {
	  let flesch = fleschGrade(text);
		console.log("flesch " + flesch);
	  let dalevar = dale(text);
		console.log("dale " + dalevar);
	  let spachevar = spache(text);
		console.log("spach " + spachevar);
  	  let colemanvar = coleman(text);
		console.log("coleman " + colemanvar);
	  let gunningvar = gunning(text);
		console.log("gunning " + gunningvar);
	  let arivar = ari(text);
		console.log("ari " + arivar);
	  let smogvar = smog(text);
		console.log("smog " + smogvar);
	  let powersvar = powers(text);
		console.log("powers " + powersvar);

	  let gradeScores = [flesch,
			spachevar,
			colemanvar,
			smogvar,
			powersvar
	  ];

	  gradeScores.sort(function(a, b){return a-b});

	  //let highest = gradeScores[end];
	  //let lowest = gradeScores[0];
	  let end = gradeScores.length - 1
	  let middle = end / 2;

	  let firstHalf = gradeScores.slice(0, middle);
	  let secondHalf = gradeScores.slice(middle, end);

	  let q2 = median(gradeScores);
	  let q3 = median(secondHalf);
	  let q1 = median(firstHalf);

	  let iqr = q3 - q1;

	  let outFence = 3.0 * iqr;
	  let upBound = q3 + outFence;
	  let lowBound = q1 - outFence;
	  let inFence = 1.5 * iqr;
	  let upWarn = q3 + inFence;
	  let lowWarn = q1 - inFence;

	  let resultScores = [];

	  for (var i = 0; i < gradeScores.length; i++) {
	     if ((gradeScores[i] > lowWarn) && (gradeScores[i] < upWarn)) {
	       resultScores.push(gradeScores[i]);
	     }
	  }

	  resultScores.sort(function(a, b){return a-b});
	  let lowGrade = resultScores[0];
	  let highGrade = resultScores[resultScores.length - 1];

	  return "Estimated reading level: grade " + parseFloat(Math.round(lowGrade*100)/100).toFixed(1) + " to " + parseFloat(Math.round(highGrade*100)/100).toFixed(1);
	}

	function median(scores) {
	  let half = Math.floor(scores.length/2);
	  if(scores.length % 2)
	    return scores[half];
	  else
	    return (scores[half-1] + scores[half]) / 2.0;
	}

	/*-- /UNUSED FUNCTIONS --*/

	module.exports = Flesch;

})();
