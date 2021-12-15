<template>

	<div id="home-vue">

		<div class="content">

			<!-- Start new session -->
			<div id="home-container">
				<div id="debug-offset">

				</div>
				<div class="row">
					<form v-on:submit.prevent="requestNewName" class="input-group col-md-4 offset-md-4" >
						<input type="text" id="queryField" name="queryField" class="form-control"
						placeholder="Enter user name..." v-model="sessionName">
						<button type="submit" class="btn btn-primary" id="session-button">Start Session</button>
					</form>
				</div>
				
			</div>

		</div>

	</div>

</template>

<script>
	export default {
		name: 'home',
		data: function () {
			return {
			}
		},
		methods: {
			requestNewName: function() {
				//used to set a new name for the session
				const data = {
					sessionName: this.sessionName
				}
				axios.post('/logSetName', data);
				window.location.replace("/");
			},
		}
	}



</script>
