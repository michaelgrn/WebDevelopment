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
			</div>
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

	export default {
		name: 'home',
		data: function () {

		}
	}

</script>
