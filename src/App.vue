<template>
	<router-view />
</template>

<script lang="ts">
export default {
	name: 'App',

	created: function () {
		window.addEventListener("resize", this.resizeHandler);
	},

	unmounted: function ()  {
		window.removeEventListener("resize", this.resizeHandler);
	},

	mounted: function () {
		this.resizeHandler();
	},

	methods: {
		resizeHandler()  {
			document.documentElement.style.setProperty('--vh', `${(window.innerHeight*.01)}px`);
		},
	}
}
</script>
