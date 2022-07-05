<template>
	<div class="drawer drawer-mobile">
		<input id="side-drawer" type="checkbox" class="drawer-toggle">
		<div class="drawer-content flex flex-col">
			<nav class="px-4 py-4 navbar justify-between">
				<span class="hidden lg:block" />
				<div class="flex gap-2">
					<label for="side-drawer" class="btn btn-square btn-ghost drawer-button lg:hidden">
						<svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
							<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd" />
						</svg>
					</label>
					<p class="hidden md:block lg:hidden">
						<img class="max-h-[30px] min-h-[30px]" src="@/assets/logo.svg">
					</p>
					<p class="block md:hidden">
						<img class="max-h-[30px] min-h-[30px]" src="@/assets/logo_small.svg">
					</p>
				</div>
				<div class="flex-none">
					<div class="dropdown dropdown-end">
						<label tabindex="0" class="btn btn-ghost btn-circle avatar">
							<div class="w-10 rounded-full">
								<img src="https://ui-avatars.com/api/?name=John+Doe">
							</div>
						</label>
						<ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 bg-base-300 shadow rounded-box w-52 gap-1 border border-neutral">
							<li>
								<router-link key="account" :to="{ name: 'Account' }">
									<svg class="h-5 w-5" viewBox="0 0 28 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path d="M21 16C22.3062 16 23.4175 16.8348 23.8293 18H14V17.5H7C6.2203 17.5 5.57955 18.0949 5.50687 18.8555L5.5 19V19.7146C5.5 22.389 8.88879 24.5 14 24.5V24H21.4712C19.6819 25.2427 17.0617 26 14 26C8.21053 26 4 23.4333 4 19.7146V19C4 17.3431 5.34315 16 7 16H21Z" />
										<path d="M24 19V19.7146C24 19.9815 23.9766 20.2436 23.9308 20.5H14V19H24Z" />
										<path d="M23.6286 21.5H14V23H22.6339C23.0614 22.5387 23.397 22.0359 23.6286 21.5Z" />
										<path d="M19.9536 7.25C19.9842 7.4957 20 7.746 20 8C20 8.254 19.9842 8.5043 19.9536 8.75H14V7.25H19.9536Z" />
										<path d="M19.7408 6.25C19.5777 5.71438 19.3417 5.21053 19.0444 4.75H14V6.25H19.7408Z" />
										<path d="M14 2C15.6531 2 17.1501 2.66854 18.2353 3.75H14V3.5C11.5147 3.5 9.5 5.51472 9.5 8C9.5 10.4853 11.5147 12.5 14 12.5V12.25H18.2353C17.1501 13.3315 15.6531 14 14 14C10.6863 14 8 11.3137 8 8C8 4.68629 10.6863 2 14 2Z" />
										<path d="M19.0444 11.25H14V9.75H19.7408C19.5777 10.2856 19.3417 10.7895 19.0444 11.25Z" />
									</svg>
									Account
								</router-link>
							</li>
							<li>
								<a @click="logout()">
									<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.3 490.3" fill="currentColor">
										<path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1C27.9,58.95,0,86.75,0,121.05z" />
										<path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63C380.6,325.15,380.6,332.95,385.4,337.65z" />
									</svg>
									Logout
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<!-- Page content -->
			<main class="container px-5 max-w-[1040px] mx-auto pt-10">
				<router-view />
			</main>
		</div>
		<aside class="drawer-side">
			<label for="side-drawer" class="drawer-overlay" />
			<div class="flex flex-col p-4 overflow-y-auto w-60 bg-base-300">
				<div class="h-[48px] flex justify-start md:justify-center items-center pl-[14px] md:pl-0">
					<p class="hidden md:block">
						<img class="max-h-[30px] min-h-[30px]" src="@/assets/logo.svg">
					</p>
					<p class="block md:hidden">
						<img class="max-h-[30px] min-h-[30px]" src="@/assets/logo_small.svg">
					</p>
				</div>
				<ul class="flex-grow -mx-4 menu p-4 text-base-content gap-1">
					<li>
						<router-link key="servers" :to="{ name: 'Servers' }" :class="$route.meta.child === 'servers' ? 'router-link-active' : ''">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
								<path d="M13 18.002a.998.998 0 0 1-.94-.658L8.986 8.889l-2.048 5.465a1.001 1.001 0 0 1-1.794.163l-2.187-3.645-1.124 1.685a1.001 1.001 0 0 1-1.664-1.11l2-3a.966.966 0 0 1 .856-.445.997.997 0 0 1 .833.485l1.935 3.224 2.27-6.06A1 1 0 0 1 9 5h.005a1 1 0 0 1 .935.659l2.946 8.102 3.152-11.035c.12-.421.502-.715.94-.725.43-.026.833.268.97.684l2 6a1 1 0 1 1-1.896.632l-.98-2.933-3.11 10.89a1 1 0 0 1-.927.726H13" />
							</svg>
							Servers
						</router-link>
					</li>
					<li>
						<router-link key="incidents" :to="{ name: 'Incidents' }">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.944C7.84496 3.87782 5.06127 4.96373 2.166 5C2.056 5.649 2 6.319 2 7C2 12.225 5.34 16.67 10 18.317C14.66 16.67 18 12.225 18 7C18 6.318 17.943 5.65 17.834 4.999C14.9389 4.963 12.1552 3.87746 10 1.944ZM11 14C11 14.2652 10.8946 14.5196 10.7071 14.7071C10.5196 14.8946 10.2652 15 10 15C9.73478 15 9.48043 14.8946 9.29289 14.7071C9.10536 14.5196 9 14.2652 9 14C9 13.7348 9.10536 13.4804 9.29289 13.2929C9.48043 13.1054 9.73478 13 10 13C10.2652 13 10.5196 13.1054 10.7071 13.2929C10.8946 13.4804 11 13.7348 11 14ZM11 7C11 6.73478 10.8946 6.48043 10.7071 6.29289C10.5196 6.10536 10.2652 6 10 6C9.73478 6 9.48043 6.10536 9.29289 6.29289C9.10536 6.48043 9 6.73478 9 7V10C9 10.2652 9.10536 10.5196 9.29289 10.7071C9.48043 10.8946 9.73478 11 10 11C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10V7Z" />
							</svg>
							Incidents
						</router-link>
					</li>
				</ul>
				<ul class="-mx-4 -mb-4 menu p-4 text-base-content gap-1">
					<li>
						<router-link key="billing" :to="{ name: 'Billing' }" class="text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
								<path d="M4 4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V7H18V6C18 5.46957 17.7893 4.96086 17.4142 4.58579C17.0391 4.21071 16.5304 4 16 4H4Z" />
								<path d="M18 9H2V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H16C16.5304 16 17.0391 15.7893 17.4142 15.4142C17.7893 15.0391 18 14.5304 18 14V9ZM4 13C4 12.7348 4.10536 12.4804 4.29289 12.2929C4.48043 12.1054 4.73478 12 5 12H6C6.26522 12 6.51957 12.1054 6.70711 12.2929C6.89464 12.4804 7 12.7348 7 13C7 13.2652 6.89464 13.5196 6.70711 13.7071C6.51957 13.8946 6.26522 14 6 14H5C4.73478 14 4.48043 13.8946 4.29289 13.7071C4.10536 13.5196 4 13.2652 4 13ZM9 12C8.73478 12 8.48043 12.1054 8.29289 12.2929C8.10536 12.4804 8 12.7348 8 13C8 13.2652 8.10536 13.5196 8.29289 13.7071C8.48043 13.8946 8.73478 14 9 14H10C10.2652 14 10.5196 13.8946 10.7071 13.7071C10.8946 13.5196 11 13.2652 11 13C11 12.7348 10.8946 12.4804 10.7071 12.2929C10.5196 12.1054 10.2652 12 10 12H9Z" />
							</svg>
							Billing
						</router-link>
					</li>
					<li>
						<router-link key="notifications" :to="{ name: 'Notifications' }" class="text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
								<path d="M10 2C8.40873 2 6.88261 2.63214 5.75739 3.75736C4.63217 4.88258 4.00003 6.4087 4.00003 8V11.586L3.29303 12.293C3.15322 12.4329 3.05802 12.611 3.01945 12.805C2.98088 12.9989 3.00068 13.2 3.07635 13.3827C3.15202 13.5654 3.28016 13.7215 3.44457 13.8314C3.60898 13.9413 3.80228 14 4.00003 14H16C16.1978 14 16.3911 13.9413 16.5555 13.8314C16.7199 13.7215 16.848 13.5654 16.9237 13.3827C16.9994 13.2 17.0192 12.9989 16.9806 12.805C16.942 12.611 16.8468 12.4329 16.707 12.293L16 11.586V8C16 6.4087 15.3679 4.88258 14.2427 3.75736C13.1175 2.63214 11.5913 2 10 2ZM10 18C9.20438 18 8.44132 17.6839 7.87871 17.1213C7.3161 16.5587 7.00003 15.7956 7.00003 15H13C13 15.7956 12.684 16.5587 12.1214 17.1213C11.5587 17.6839 10.7957 18 10 18Z" />
							</svg>
							Notifications
						</router-link>
					</li>
					<li>
						<router-link key="help" :to="{ name: 'Help' }" class="text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5" fill="currentColor">
								<path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-4.1a1.1 1.1 0 1 0 .001 2.201A1.1 1.1 0 0 0 10 13.9M10 4C8.625 4 7.425 5.161 7.293 5.293A1.001 1.001 0 0 0 8.704 6.71C8.995 6.424 9.608 6 10 6a1.001 1.001 0 0 1 .591 1.808C9.58 8.548 9 9.616 9 10.737V11a1 1 0 1 0 2 0v-.263c0-.653.484-1.105.773-1.317A3.013 3.013 0 0 0 13 7c0-1.654-1.346-3-3-3" />
							</svg>
							Help & Support
						</router-link>
					</li>
				</ul>
			</div>
		</aside>
	</div>
</template>

<script>
import { initWS, closeWS, CDC_VALUES } from '@/utils/websockets';
import { useMainStore } from '@/stores/main';
import { useServersStore } from '@/stores/servers';
import { nextTick } from 'vue';

export default {
	name: 'Base',

	setup () {
		const store = useMainStore();
		const serversStore = useServersStore();
		return { store, serversStore }
	},

	data () {
		return {
			connection: null,
		}
	},

	mounted: function () {
		const vm = this

		// Don't setup anything before everything is rendered
		nextTick(async () => {
			// Populate the list with the berta and all
			initWS(vm.$authCdc, "apikeys", "*", ":customer_id.eq." + vm.store.userId, false, vm, vm.wsAuthMessageHandle);
			await vm.serversStore.fetchApiKeysAndBertas(vm);
			await vm.serversStore.fetchHostsAllBertas(vm);
		})
	},

	beforeUnmount: function () {
		// Close the webSocket connection
		closeWS("apikeys", this);
	},

	methods: {
		logout: async function() {
			await this.$http.get(this.$authBase + "/api/logout")
				.then(() => {
					this.store.logout();
					this.$router.replace({ name: 'Login' });
				}).catch((err) => {
					console.log(err);
				});
		},
		wsAuthMessageHandle: async function(event) {
			const json = JSON.parse(event.data);
			const kind = json["kind"];
			const jsonValues = json[CDC_VALUES];

			const keyObj = {
				id: jsonValues[0],
				key: jsonValues[1],
				host_uuid: jsonValues[2],
				customer_id: jsonValues[3],
				berta: jsonValues[4],
				granularity: 3000,
			};

			switch (kind) {
			case "update": {
				if (keyObj.host_uuid === null) break;
				// If the keys is present in unconfiguredKeys
				// we restart the hosts websocket with the new values
				// and remove from unconfiguredKeys
				const index = this.serversStore.unconfiguredKeys.findIndex((el) => el.key === keyObj.key);
				if (index !== -1) this.serversStore.unconfiguredKeys.splice(index, 1);
				// Add to bertas list
				let thisBerta = this.serversStore.bertas.get(keyObj.berta);
				if (thisBerta === undefined) {
					if (keyObj.host_uuid !== null) {
						this.serversStore.bertas.set(keyObj.berta, new Set([keyObj.host_uuid]));
					} else {
						this.serversStore.bertas.set(keyObj.berta, new Set());
					}
				} else {
					thisBerta.add(keyObj.host_uuid);
				}

				// Init fetch for the host and retry max 3 times with 150ms delay
				// - the retry is needed because the host will for the first time
				//   push but fail because the key won't have the host_uuid yet.
				//   Thus returning a PRECONDITION FAILED and the client will update
				//   the key and then repush the metrics (for the first time only).
				let retry = 0;
				do {
					if (await this.serversStore.fetchSpecificHost(this, keyObj) === undefined) {
						break;
					}
					retry += 1;
					await new Promise(r => setTimeout(r, 150));
				}
				while (retry <= 2);
				break;
			}
			case "insert": {
				// Add to the unconfiguredKeys
				this.serversStore.unconfiguredKeys.push(keyObj);
				break;
			}
			case "delete": {
				// Delete from the unconfiguredKeys
				const index = this.serversStore.unconfiguredKeys.findIndex((el) => el.key === keyObj.key);
				if (index !== -1) this.serversStore.unconfiguredKeys.splice(index, 1);
				// We don't do anything else because the hosts websocket will stop emitting
				// so it's not worth restarting it without the hosts
				break;
			}
			}
		}
	}
}
</script>