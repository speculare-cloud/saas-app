<template>
	<div class="drawer">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle">
		<div class="drawer-content flex flex-col">
			<!-- Navbar -->
			<div class="bg-neutral text-neutral-content">
				<header class="navbar max-w-6xl mx-auto">
					<div class="flex-none md:hidden">
						<label for="my-drawer-3" class="btn btn-square btn-ghost">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
						</label>
					</div>
					<div class="flex-1">
						<a class="btn btn-ghost normal-case text-xl">Speculare</a>
					</div>
					<div class="flex-none">
						<div class="dropdown dropdown-end">
							<label tabindex="0" class="btn btn-ghost btn-circle avatar">
								<div class="w-10 rounded-full">
									<img src="https://avatars.dicebear.com/api/bottts/speculare.svg">
								</div>
							</label>
							<ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52">
								<li><a>Settings</a></li>
								<li><a @click="logout">Logout</a></li>
							</ul>
						</div>
					</div>
				</header>
			</div>
			<!-- Page content -->
			<main class="flex-1 w-full flex justify-center">
				<section class="flex-1 max-w-6xl px-6 py-6 flex flex-row justify-center">
					<div class="hidden md:block sticky">
						<ul class="menu bg-neutral text-neutral-content w-52 p-2 rounded-box gap-2">
							<li>
								<a class="currentSideNav">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
										<path d="M13 18.002a.998.998 0 0 1-.94-.658L8.986 8.889l-2.048 5.465a1.001 1.001 0 0 1-1.794.163l-2.187-3.645-1.124 1.685a1.001 1.001 0 0 1-1.664-1.11l2-3a.966.966 0 0 1 .856-.445.997.997 0 0 1 .833.485l1.935 3.224 2.27-6.06A1 1 0 0 1 9 5h.005a1 1 0 0 1 .935.659l2.946 8.102 3.152-11.035c.12-.421.502-.715.94-.725.43-.026.833.268.97.684l2 6a1 1 0 1 1-1.896.632l-.98-2.933-3.11 10.89a1 1 0 0 1-.927.726H13" />
									</svg>
									Servers
								</a>
							</li>
							<li>
								<a>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
										<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8M9.977 7c.026 0 .649.04 1.316.707a1 1 0 0 0 1.414-1.414A4.487 4.487 0 0 0 11 5.2V5a1 1 0 1 0-2 0v.184A2.996 2.996 0 0 0 7 8c0 2.28 1.727 2.713 2.758 2.97C10.873 11.25 11 11.354 11 12c0 .552-.448 1-.976 1-.026 0-.65-.04-1.317-.707a1 1 0 0 0-1.414 1.415A4.502 4.502 0 0 0 9 14.798v.2a1 1 0 1 0 2 0v-.184A2.995 2.995 0 0 0 13 12c0-2.28-1.726-2.712-2.757-2.97C9.128 8.752 9 8.646 9 8c0-.55.449-1 .977-1" />
									</svg>
									Billing
								</a>
							</li>
							<li>
								<a>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
										<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-4.1a1.1 1.1 0 1 0 .001 2.201A1.1 1.1 0 0 0 10 13.9M10 4C8.625 4 7.425 5.161 7.293 5.293A1.001 1.001 0 0 0 8.704 6.71C8.995 6.424 9.608 6 10 6a1.001 1.001 0 0 1 .591 1.808C9.58 8.548 9 9.616 9 10.737V11a1 1 0 1 0 2 0v-.263c0-.653.484-1.105.773-1.317A3.013 3.013 0 0 0 13 7c0-1.654-1.346-3-3-3" />
									</svg>
									Help & Support
								</a>
							</li>
						</ul>
					</div>
					<div class="hidden md:divider md:divider-horizontal" />
					<!-- Real Page content -->
					<router-view />
					<!-- END Real Page content -->
				</section>
			</main>
			<!-- END Page content -->
		</div>
		<!-- Sidebar nav -->
		<div class="drawer-side">
			<label for="my-drawer-3" class="drawer-overlay" />
			<ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
				<li>
					<a class="currentSideNav">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
							<path d="M13 18.002a.998.998 0 0 1-.94-.658L8.986 8.889l-2.048 5.465a1.001 1.001 0 0 1-1.794.163l-2.187-3.645-1.124 1.685a1.001 1.001 0 0 1-1.664-1.11l2-3a.966.966 0 0 1 .856-.445.997.997 0 0 1 .833.485l1.935 3.224 2.27-6.06A1 1 0 0 1 9 5h.005a1 1 0 0 1 .935.659l2.946 8.102 3.152-11.035c.12-.421.502-.715.94-.725.43-.026.833.268.97.684l2 6a1 1 0 1 1-1.896.632l-.98-2.933-3.11 10.89a1 1 0 0 1-.927.726H13" />
						</svg>
						Servers
					</a>
				</li>
				<li>
					<a>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
							<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8M9.977 7c.026 0 .649.04 1.316.707a1 1 0 0 0 1.414-1.414A4.487 4.487 0 0 0 11 5.2V5a1 1 0 1 0-2 0v.184A2.996 2.996 0 0 0 7 8c0 2.28 1.727 2.713 2.758 2.97C10.873 11.25 11 11.354 11 12c0 .552-.448 1-.976 1-.026 0-.65-.04-1.317-.707a1 1 0 0 0-1.414 1.415A4.502 4.502 0 0 0 9 14.798v.2a1 1 0 1 0 2 0v-.184A2.995 2.995 0 0 0 13 12c0-2.28-1.726-2.712-2.757-2.97C9.128 8.752 9 8.646 9 8c0-.55.449-1 .977-1" />
						</svg>
						Billing
					</a>
				</li>
				<li>
					<a>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
							<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-4.1a1.1 1.1 0 1 0 .001 2.201A1.1 1.1 0 0 0 10 13.9M10 4C8.625 4 7.425 5.161 7.293 5.293A1.001 1.001 0 0 0 8.704 6.71C8.995 6.424 9.608 6 10 6a1.001 1.001 0 0 1 .591 1.808C9.58 8.548 9 9.616 9 10.737V11a1 1 0 1 0 2 0v-.263c0-.653.484-1.105.773-1.317A3.013 3.013 0 0 0 13 7c0-1.654-1.346-3-3-3" />
						</svg>
						Help & Support
					</a>
				</li>
			</ul>
		</div>
		<!-- END Sidebar nav -->
	</div>
</template>

<script>
export default {
	name: 'Base',

	methods: {
		logout: async function() {
			await this.$http.get(this.$authBase + "/api/logout")
				.then(() => {
					this.$store.commit({
						type: 'setLogged',
						isLogged: false
					});
					this.$router.replace({ name: 'Login' });
				}).catch((err) => {
					console.log(err);
				});
		},
	}
}
</script>