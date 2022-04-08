<template>
	<div class="overflow-x-hidden w-full h-screen">
		<div class="max-w-6xl mx-auto">
			<header class="navbar bg-base-100">
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
						<ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52" data-theme="light">
							<li><a>Settings</a></li>
							<li><a @click="logout">Logout</a></li>
						</ul>
					</div>
				</div>
			</header>

			<main class="mt-4">
				<div class="flex items-center justify-between mb-8">
					<h3 class="text-2xl">
						Have a great day!
					</h3>
					<div class="flex gap-4">
						<div class="form-control">
							<input type="text" placeholder="Search" class="input input-bordered">
						</div>
						<button @click="generateKey" class="btn">
							Add new
						</button>
					</div>
				</div>

				<div class="card w-full bg-neutral text-neutral-content">
					<div class="card-body items-center text-center">
						<h2 class="card-title">
							Cookies!
						</h2>
						<p>We are using cookies for no reason.</p>
						<div class="card-actions justify-end">
							<button class="btn btn-primary">
								Accept
							</button>
							<button class="btn btn-ghost">
								Deny
							</button>
						</div>
					</div>
					<div class="divider my-0 h-0" /> 
					<div class="card-body items-center text-center">
						<h2 class="card-title">
							Cookies!
						</h2>
						<p>We are using cookies for no reason.</p>
						<div class="card-actions justify-end">
							<button class="btn btn-primary">
								Accept
							</button>
							<button class="btn btn-ghost">
								Deny
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Home',

	methods: {
		logout: async function() {
			await this.$http.get("https://auth.speculare.cloud/api/logout")
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
		generateKey: async function() {
			await this.$http.post("https://auth.speculare.cloud/api/key", {})
				.then((resp) => {
					console.log("New key: ", resp);
				}).catch((err) => {
					console.log(err);
				});
		}
	}
}
</script>