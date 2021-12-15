<template>

	<div id="home-vue">

		<div class="content">

			<!-- Title and Search -->
			<div id="home-container">
				<div id="home-logo-container">
					<img id="home-logo" src="/images/ClassroomLogo.png" alt="LITERATE Logo">
				</div>
				<h1 id="home-title">{{title}}</h1>
				<div class="row">
					<form action="searchPage" method="get" class="input-group col-md-4 offset-md-4">
						<input type="text" id="queryField" name="queryField" class="form-control"
						placeholder="Search by subject..." v-model="searchQuery">
						<button type="submit" class="btn btn-primary" id="search-button">Search</button>
						<a id="feedback" href="https://goo.gl/forms/h8fiYCYTuxAtw3Lj2" title="Provide Feedback"><i class="far fa-comment-alt fa-2x" aria-hidden="false"></i></a>
					</form>
				</div>
				<div v-show="searching" id="loader"></div>
			</div>
			<!-- /Title and Search -->

			<!-- Results Header1 -->
			<div id="home-container">
				<div v-if="articlesLoaded" class="Aligner">
					<div class="row" id="results-head">
						<div class="flex-container">
							<div class="art-head">
								<h3 class="inline">
									{{numArticles}} articles ({{getFilteredOutCount()}} filtered out)
								</h3>
							</div>

							<div class="inline-hide">
								Hide filtered out results
								<input type="checkbox"
								v-on:change="logFilter"
								v-model="hideFilteredOutResults">
							</div>
							<!-- /Filtering -->

						</div>
					</div>
				</div>
				<!-- /Results Header -->
				<!-- Results Header2 -->
				<div v-if="articlesLoaded" class="Aligner">
					<div class="row" id="results-head">
						<div class="flex-container">

							<!-- Filtering -->
							<i class="fas fa-graduation-cap" aria-hidden="true" title="Grade Level"></i>
							<div class="inline-slider">
								<vue-slider
								ref="slider"
								v-on:release="logFilter"
								v-model="educationSliderOptions.value"
								v-bind="educationSliderOptions"
								>
							</vue-slider>
						</div>
						<div class="spacer"></div>
						<i class="fas fa-book" aria-hidden="true" title="Word Count"></i>
						<div class="inline-slider">
							<vue-slider
							ref="slider"
							v-model="wordCountSliderOptions.value"
							v-bind="wordCountSliderOptions">
						</vue-slider>
					</div>

					<!-- /Filtering -->

				</div>
			</div>
		</div>
	</div>
	<!-- Results -->
	<transition name="fade">
		<div v-if="articlesLoaded" class="col-md-8 offset-md-2" id="search-results">

			<!-- Articles List -->
			<div class="article-list">
				<ul class="list-group" id="articles-ul">
					<li v-for="article in articles"
					v-bind:class="{ filtered: filteredOut(article), unfiltered: !filteredOut(article) }" >

					<transition name="article-fade" mode="out-in">

						<!-- Filtered Out View -->
						<ul v-if="filteredOut(article) && !hideFilteredOutResults"
						class="list-group article-display" key=1>
						<li class="list-group-item">
							<div class="row">
								<a class="article-title article-head col-md-10" v-on:contextmenu = "logFilteredContextMenu(article)" v-on:click.prevent = "logFilteredRedirect(article)" :href="getArticleURL(article)">
									{{article.title}}
								</a>
								<div class="col-md-2">
									<transition name="fade">
										<i v-if="article.filtered.wordCount" class="fas fa-book float-right"></i>
									</transition>
									<transition name="fade">
										<i v-if="article.filtered.educationLevel" class="fas fa-graduation-cap float-right"></i>
									</transition>
								</div>
							</div>
						</li>
					</ul>
					<!-- /Filtered Out View -->

					<!-- Filtered Out Hidden -->
					<ul v-else-if="filteredOut(article) && hideFilteredOutResults"
					class="list-group"
					key=2>
				</ul>
				<!-- Filtered Out Hidden -->

				<!-- Default View -->
				<ul v-else class="list-group article-display" key=3>

					<!-- Article Title -->
					<li class="list-group-item">
						<div class="row">
							<a class="article-title article-head" v-on:contextmenu = "logContextMenu(article)" v-on:click.prevent = "logRedirect(article)" :href="getArticleURL(article)">
								{{article.title}}
							</a>
						</div>
						<hr>
						<div class="row">
							<p class="article-description article-head">
								<i>{{article.description}}</i>
							</p>
						</div>
					</li>
					<!-- /Article Title -->

					<!-- Article Tags -->
					<li class="list-group-item">
						<transition name="fade">
							<h4 v-if="article.video" class="inline" key=1>
								<span class="badge badge-danger">Video</span>
							</h4>
							<h4 v-else-if="article.resultsLoaded" class="inline" key=2>
								<span class="badge badge-success">Text</span>
							</h4>
						</transition>
						<transition>
							<h4 v-if="article.subscription" class="inline">
								<span class="badge badge-info">Subscription</span>
							</h4>
						</transition>
						<h6 class="article-key-data inline">
							{{article.source.name}} - {{article.publishedAt}}
						</h6>
						<template v-if="error === ''">
							<button v-if="!article.hasTags"  @click="article.show = !article.show" v-on:click = "logInfo(article, article.show)" class="btn btn-sm btn-info float-right info-button" :disabled="!article.resultsLoaded">
								<div v-if="article.resultsLoaded">
									{{article.show ? 'Hide info' : 'More info'}}
								</div>
								<div v-else class="spinner">
									<div class="bounce1"></div>
									<div class="bounce2"></div>
									<div class="bounce3"></div>
								</div>
							</button>
						</template>
					</li>
					<!-- /Article Tags -->

					<!-- Article Metadata -->
					<template v-if="error === ''"> <!-- Display if no errors -->
						<transition name="fade">
							<li v-show="article.show" class="list-group-item list-group-item-secondary">
								<table class="table table-light">
									<tbody v-if="article.resultsLoaded">
										<tr>
											<th scope="row">Flesch</th>
											<td>{{article.flesch.educationLevel.text}}</td>
										</tr>
										<tr>
											<th scope="row">Word Count</th>
											<td>{{article.wordCount}}</td>
										</tr>
										<tr>
											<th scope="row">Number of Images</th>
											<td>{{article.imageCount}}</td>
										</tr>
										<tr>
											<th scope="row">Keywords</th>
											<td>{{article.keywords}}</td>
										</tr>
									</tbody>
								</table>
							</li>
						</transition>
					</template>
					<!-- /Article Metadata -->

				</ul>
				<!-- /Default View -->
			</transition>

		</li>
	</ul>
</div>
<!-- /Articles List -->

</div>
</transition>
<!-- /Results -->

</div>

<!-- Footer -->
<footer class="footer">
	<div class="container">
		<a class="text-muted" href="https://newsapi.org">Powered by News API</a> ||
		<a class="text-muted" href="https://coen.boisestate.edu/piret/projects/literate/">About This Project</a>
	</div>
</footer>
<!-- /Footer -->

</div>

</template>

<script>

	import Slider from '../public/vue-components/vue-slider-component/vue2-slider.vue';

	export default {

		name: 'home',
		components: {
			'vue-slider': Slider
		},
		data: function () { // XXX this is what the view is based on 

			return {
				articles: [],
				articlesLoaded: false,
				educationSliderOptions: {
					value: [
					//left empty to fill in for cookie values
					],
					width: 200,
					height: 10,
					dotSize: 24,
					interval: 1,
					piecewise: true,
					data: [
					'5th grade (or lower)',
					'6th grade',
					'7th grade',
					'8th grade',
					'9th grade',
					'10th grade',
					'11th grade',
					'12th grade',
					'College student',
					'College graduate',
					]
				},
				error: '',
				filter: {
					educationLevel: {
						low: 5,
						high: 14
					},
					wordCount: {
						low: 0,
						high: 10000
					}
				},
				hideFilteredOutResults: false,
				searching: false,
				searchInitiated: false,
				wordCountSliderOptions: {
					value: [
					//left empty to fill in for cookie values
					],
					min: 0,
					max: 10000,
					width: 200,
					height: 10,
					dotSize: 24,
					interval: 100,
					piecewise: true,
				},
			}
		},
		watch: { // Performs actions each time either slider changes in value
			educationSliderOptions: {

				handler(val) {
					this.updateEducationFilterValues(val.value[0], val.value[1]);
				},
				deep: true
			},

			wordCountSliderOptions: {

				handler(val) {
					this.logWordCountChange(this.filter.wordCount.low, this.filter.wordCount.high, val.value[0], val.value[1]);
					this.filter.wordCount.low = val.value[0];
					this.filter.wordCount.high = val.value[1];
					this.updateCookie();
				},
				deep: true
			}

		},

		methods: {
			analyzeArticle: function(article) {
				// Requests analysis on an article to update the view with the data
				const data = {
					article: article
				};

				return axios.post('/readability', data)
				.then(result => {
					let analyzedArticle = result.data.article
					analyzedArticle.filtered = {
						educationLevel: this.filterEducationLevel(analyzedArticle),
						wordCount: this.filterWordCount(analyzedArticle)
					}
					this.logReadability(analyzedArticle);
					let index = this.getArticleIndex(article);
					this.articles.splice(index, 1, analyzedArticle);
				})
				.catch(error => {
					console.log('error:', error);
					this.error = error.data;
				});
			},
			analyzeArticles: function() {
				// Requests analysis on each article that was returned by
				// the search request
				let promises = this.articles.map(article => {
					return this.analyzeArticle(article);
				});
				Promise.all(promises).then(() => {
					// TODO: ???
					console.log('analysis of all articles complete');
				}).catch(error => {
					console.log('error:', error);
					this.error = error.data;
				});
			},
			filteredOut: function(article) {
				// Returns true if the article should be filtered out, false otherwise
				if (article.resultsLoaded) {
					article.filtered.educationLevel = this.filterEducationLevel(article);
					article.filtered.wordCount = this.filterWordCount(article);
				}
				return (article.resultsLoaded) &&
				(article.filtered.educationLevel || article.filtered.wordCount);
			},
			filterEducationLevel: function(article) {
				// Returns true if the article should be filtered out due to education level
				let data = article.flesch.educationLevel.value;
				return (data.low < this.filter.educationLevel.low || data.high > this.filter.educationLevel.high);
			},
			filterWordCount: function(article) {
				// Returns true if the article should be filtered out due to word count
				let wordCount = article.wordCount;
				return (wordCount >= this.wordCountSliderOptions.max || wordCount < this.filter.wordCount.low || wordCount > this.filter.wordCount.high);
			},
			getArticleIndex: function(article) {
				// Returns the index of the articles in the client-side data
				return this.articles.findIndex(localArticle => localArticle.url === article.url);
			},
			getArticleURL: function(article) {
				// Returns the index of the articles in the client-side data
				return "/reroute?url="+ article.url;
			},
			getCookie(cname) {
				//used to retrieve data from the cookie
				var name = cname + "=";
				var decodedCookie = decodeURIComponent(document.cookie);
				var ca = decodedCookie.split(';');
				for(var i = 0; i <ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			},
			getKeywords: function(article) {
				// Returns the top 3 (or less) keywords of the articles
				return article.keywords;
			},
			getEducationValue: function(text) {
				// Returns the value of the education level based on the textual representation
				switch (text) {
					case '5th grade (or lower)':
					return 5;
					case '6th grade':
					return 6;
					case '7th grade':
					return 7;
					case '8th grade':
					return 8;
					case '9th grade':
					return 9;
					case '10th grade':
					return 10;
					case '11th grade':
					return 11;
					case '12th grade':
					return 12;
					case 'College student':
					return 13;
					case 'College graduate':
					return 14;
				}
			},
			getEducationValue2: function(text) {
				// Returns the value of the education level based on the textual representation
				switch (text) {
					case 5:
					return '5th grade (or lower)';
					case 6:
					return '6th grade';
					case 7:
					return '7th grade';
					case 8:
					return '8th grade';
					case 9:
					return '9th grade';
					case 10:
					return '10th grade';
					case 11:
					return '11th grade';
					case 12:
					return '12th grade';
					case 13:
					return 'College student';
					case 14:
					return 'College graduate';
				}
			},

			getFilteredOutCount: function() {
				// returns the number of articles that are currently filtered out
				return this.articles.filter(article => this.filteredOut(article)).length;
			},
			logFilter: function() {
				//logs a click on the filter out check box
				const data = {
					hideFilteredOutResults: this.hideFilteredOutResults
				}
				axios.post('/logFilterChange', data);
			},
			logReadability: function(article) {
				//logs readability data
				axios.post('/logReadability', article);
			},
			logContextMenu: function(info) {
				//logs a right click on an article
				let index = this.getArticleIndex(info);
				const data = {
					ArticleIndex: index,
					ArticleURL: info.url,
				}
				axios.post('/logContextMenu', data);
			},
			logFilteredContextMenu: function(info) {
				//logs a right click on a filtered article
				let index = this.getArticleIndex(info);
				const data = {
					ArticleIndex: index,
					ArticleURL: info.url,
				}
				axios.post('/logFilteredContextMenu', data);
			},
			logFilteredRedirect: function(info) {
				//logs when a filtered out article is clicked
				let index = this.getArticleIndex(info);
				const data = {
					ArticleIndex: index,
					ArticleURL: info.url,
				}
				axios.post('/logFilteredRedirect', data);
				window.open(info.url);
			},
			logGradeChange: function(oldLow, oldHigh, newLow, newHigh) {
				//logs a change in grade range
				const data = {
					NewLow: newLow,
					NewHigh: newHigh,
					OldLow: oldLow,
					OldHigh: oldHigh,
				}
				axios.post('/logGradeChange', data);
			},
			logInfo: function(info, show) {
				//logs when more info is clicked
				let index = this.getArticleIndex(info);
				let url = info.url;
				let keywords = this.getKeywords(info);
				let aShow = show;
				let flesch = info.flesch.educationLevel.text;
				let wordCount = info.wordCount;
				let images = info.imageCount;
				const data = {
					ArticleIndex: index,
					ArticleURL: url,
					ArticleKeywords: keywords,
					Show: aShow,
					Flesch: flesch,
					WordCount: wordCount,
					Images: images,
				}
				axios.post('/logToggleInfo', data);
			},
			logRedirect: function(info) {
				//logs a click on an article
				let index = this.getArticleIndex(info);
				const data = {
					ArticleIndex: index,
					ArticleURL: info.url,
				}
				axios.post('/logRedirect', data);
				window.open(info.url);
			},
			logWordCountChange: function(oldLow, oldHigh, newLow, newHigh) {
				//logs a change in word count filter
				const data = {
					NewLow: newLow,
					NewHigh: newHigh,
					OldLow: oldLow,
					OldHigh: oldHigh,
				}
				axios.post('/logWordCountChange', data);
			},
			requestSearch: function() { // XXX
				// Requests a search based on the user's query
				// Updates the client-side data for view update
				this.updateCookie;
				this.searching = true;
				this.articlesLoaded = false;
				const data = {
					searchQuery: this.searchQuery
				}

				axios.post('/logSearch', data);
				axios.post('/search', data)
				.then(result => {
					this.articles = result.data.articles;
					this.numArticles = result.data.numArticles;
					this.searching = false;
					this.searchInitiated = true;
					this.error = result.data.error;
					this.analyzeArticles();
					this.articlesLoaded = true;
				})
				.catch(error => {
					console.log('error:', error);
					this.error = error.data;
				});

			},
			updateEducationFilterValues: function(low, high) {
				//updates the education filter as well as logs the grade change
				this.logGradeChange(this.filter.educationLevel.low, this.filter.educationLevel.high, this.getEducationValue(low),this.getEducationValue(high));
				this.filter.educationLevel.low = this.getEducationValue(low);
				this.filter.educationLevel.high = this.getEducationValue(high);
				this.updateCookie();

			},

			updateCookie: function() {
				//updates the cookie when filters are changed
				document.cookie = "edLow="+this.filter.educationLevel.low;
				document.cookie = "edHigh="+this.filter.educationLevel.high;
				document.cookie = "wordLow="+this.filter.wordCount.low;
				document.cookie = "wordHigh="+this.filter.wordCount.high;
			},
		},

		beforeMount: function () {
			//loads cookie values into filters and then request search on search term
			var wordLow = parseInt(this.getCookie('wordLow').replace("'",""),10);
			var wordHigh = parseInt(this.getCookie('wordHigh').replace("'",""),10);
			var edLow = parseInt(this.getCookie('edLow').replace("'",""),10);
			var edHigh = parseInt(this.getCookie('edHigh').replace("'",""),10);
			this.wordCountSliderOptions.value = [wordLow,wordHigh];
			this.educationSliderOptions.value = [this.getEducationValue2(edLow),this.getEducationValue2(edHigh)];
			this.requestSearch();
		},


	}



</script>
