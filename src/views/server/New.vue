<template>
	<section class="mb-10">
		<div class="flex-col">
			<router-link key="servers" :to="{ name: 'Servers' }" class="btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3 !pl-0 !pr-2">
				<svg
					xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8" width="24" height="24"
					viewBox="0 0 24 24">
					<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
				</svg>
				<div class="flex flex-col items-start">
					<span class="text-base-content hidden text-xs font-normal md:block">Prev</span>
					<span class="text-white">Servers</span>
				</div>
			</router-link>
			<div class="prose-sm flex justify-between items-center mt-4 mb-6 md:mb-12">
				<h1>
					New server
				</h1>
			</div>
			<div class="flex flex-col xl:flex-row xl:space-x-20 space-y-8 xl:space-y-0">
				<div class="flex-1 prose-sm xl:flex flex-col justify-center align-middle">
					<h3>Secret key</h3>
					<p class="mt-3 text-[#c5c8cb] text-sm">
						This key will be used on the server to authenticate itself towards the Speculare's servers.
					</p>
				</div>
				<div class="flex-2 bg-base-300 rounded-lg shadow px-6 py-8">
					<p class="mb-2">
						Your key
					</p>
					<input
						v-model="secretKey"
						type="text" placeholder="Generating the secret key..."
						class="input input-bordered w-full h-10 form-control-custom focus:outline-none" readonly>
					<p class="mt-2 text-[#c5c8cb] text-sm">
						You can read more about this key and how it works <a href="#" class="underline font-medium">here</a>.
					</p>
				</div>
			</div>
			<div class="divider my-12">
				then
			</div>
			<div class="flex flex-col xl:flex-row xl:space-x-20 space-y-8 xl:space-y-0">
				<!-- Workaround to make the scrollbar "rounded" -->
				<div class="overflow-hidden" style="border-radius: var(--rounded-box, 1rem);">
					<div class="flex-2 mockup-code">
						<pre data-prefix="1"><code class="code-unstyled">curl https://speculare.cloud/some_random_script.sh | bash</code></pre>
						<pre v-if="apikey?.host_uuid == null" data-prefix="2" class="bg-warning text-warning-content"><code class="code-unstyled">Waiting for data...</code></pre>
						<pre v-if="apikey?.host_uuid != null" data-prefix="2" class="bg-success text-success-content"><code class="code-unstyled">Success!</code></pre>
					</div>
				</div>
				<div class="flex-1 prose-sm xl:flex flex-col justify-center align-middle">
					<h3>Download and setup the daemon</h3>
					<p class="mt-3 text-[#c5c8cb] text-sm">
						Use the one command installer and follow the prompt. Enter the key from the previous step
						when asked.
					</p>
				</div>
			</div>
			<div class="divider my-12">
				finally
			</div>
			<div class="max-w-lg mx-auto flex flex-col justify-center gap-6">
				<div class="prose-sm rounded-lg shadow px-4 py-6" :class="apikey?.host_uuid === null ? 'bg-neutral bg-opacity-20' : 'bg-base-300'">
					<h3 class="font-semibold" :class="apikey?.host_uuid === null ? 'text-base-content text-opacity-20' : ''">
						You're all set
					</h3>
					<p class="mt-3 text-sm" :class="apikey?.host_uuid === null ? 'text-base-content text-opacity-20' : 'text-[#c5c8cb]'">
						It's all good, your server is periodically sending metrics and you can now see
						them in the dashboard.
					</p>
				</div>
				<router-link
					:to="{ name: 'Servers' }" :class="apikey?.host_uuid === null ? 'disabled' : ''"
					class="btn btn-md btn-info" key="add_server">
					goto servers
				</router-link>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { opt, optUn } from '@/utils/help';
import { initWS, closeWS } from '@/utils/websockets';
import type { ApiKey } from '@martichou/sproot';
import { nextTick } from 'vue';

export default {
	name: 'NewServer',

	data () {
		return {
			connection: opt<WebSocket>(),
			apikey: optUn<ApiKey>(),
		}
	},

	computed: {
		secretKey() {
			return this.apikey?.key
		}
	},

	mounted: function () {
		nextTick(async () => {
			if (this.$route.params.kid == null) await this.generateKey();
			else await this.getKeyInfo();

			if (this.apikey == null) return;

			initWS({
				vm: this,
				wsUrl: this.$authCdc,
				table: "apikeys",
				eventType: "update",
				filter: ":key.eq." + this.apikey.key,
			});
		})
	},

	beforeUnmount: function () {
		// Close the webSocket connection
		closeWS("apikeys", this);
	},

	methods: {
		generateKey: async function() {
			// Create a new API key and refresh the list on success
			await this.$http.post(this.$authBase + "/api/key", {})
				.then((resp) => {
					const apikey: ApiKey = resp.data;
					this.apikey = apikey;
					this.$router.replace({ name: 'NewDetails', params: { kid: apikey.id }})
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
					alert("Unknown error, try again...");
				});
		},
		getKeyInfo: async function() {
			await this.$http.get(this.$authBase + "/api/key?id=" + this.$route.params.kid)
				.then((resp) => {
					const apikey: ApiKey = resp.data;
					this.apikey = apikey;
					if (this.connection !== null) closeWS("apikeys", this);
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
					alert("Unknown error, try again...");
				});
		},
		wsMessageHandle: async function(event) {
			const json = JSON.parse(event.data);
			const columnsNames = json.columnnames;
			const columnsValues = json.columnvalues;

			const keyObj: ApiKey = Object.fromEntries(
				columnsNames.map((_, i) => [columnsNames[i], columnsValues[i]])
			) as ApiKey;
			this.apikey = keyObj;
		}
	}
}
</script>
