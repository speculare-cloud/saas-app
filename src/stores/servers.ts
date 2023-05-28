import type { ConfiguredKeys } from '@/types/ConfiguredKeys'
import { opt } from '@/utils/help'
import type { ApiKey, Host } from '@martichou/sproot'
import { defineStore } from 'pinia'

export const useServersStore = defineStore('servers', {
	state: () => {
		return {
			error: opt<any>(),
			initialLoading: true,
			// List of different Bertas hosted user's servers
			bertas: new Map(),
			// Raw keys from /api/key
			keys: new Array<ApiKey>(),
			// List of owned keys by the user with info from Bertas.
			unconfiguredKeys: new Array<ApiKey>(),
			// List of owned keys + hostname and basics info of the server
			configuredKeys: new Array<ConfiguredKeys>()
		}
	},
	actions: {
		async fetchSpecificHost (vm, keyObj: ApiKey) {
			return await vm.$http.get(vm.$serverBase(keyObj.berta) + '/api/host?uuid=' + keyObj.host_uuid)
				.then((resp) => {
					const ckey: ConfiguredKeys = {
						key: keyObj,
						host: resp.data
					}
					// Check if we already have the keys in our configuredKeys.
					const alreadyIndex = this.configuredKeys.findIndex((obj) => obj.host.uuid === ckey.host.uuid)
					if (alreadyIndex === -1) {
						this.configuredKeys.push(ckey)
					} else {
						this.configuredKeys[alreadyIndex] = ckey
					}
				}).catch(async (err) => {
					// To allow newly configured server to be fetched
					// as their data will be uploaded shortly after.
					if (err.response && err.response.status === 404) {
						return true
					}
					// TODO - Handle errors
					console.log("fetchSpecificHost", err)
				})
		},
		async fetchApiKeysAndBertas (vm) {
			// Fetch the API keys for the current user
			await vm.$http.get(vm.$authBase + '/api/key/list')
				.then((resp) => {
					resp.data.forEach((elem: ApiKey) => {
						const thisBerta = this.bertas.get(elem.berta)
						if (thisBerta === undefined) {
							if (elem.host_uuid !== null) {
								this.bertas.set(elem.berta, new Set([elem.host_uuid]))
							} else {
								this.bertas.set(elem.berta, new Set())
							}
						} else {
							thisBerta.add(elem.host_uuid)
						}

						// If the key does not exists, add it
						if (!this.keys.some((el) => el.key === elem.key)) {
							this.keys.push(elem)
						}

						// remove the element from the unconfiguredKeys if exists and is configured
						if (elem.host_uuid !== null) {
							const index = this.unconfiguredKeys.findIndex((el) => el.key === elem.key)
							if (index !== -1) this.unconfiguredKeys.splice(index, 1)
						} else if (!this.unconfiguredKeys.some((el) => el.key === elem.key)) {
							this.unconfiguredKeys.push(elem)
						}
					})
					this.error = null
				}).catch((err) => {
					// TODO - Handle errors
					this.error = err
					console.log("fetchApiKeysAndBertas", err)
				})
		},
		async fetchHostsAllBertas (vm) {
			for (const berta of this.bertas.keys()) {
				await vm.$http.get(vm.$serverBase(berta) + '/api/hosts')
					.then((resp) => {
						// Foreach server we got as response
						resp.data.forEach((elem: Host) => {
							// Check if we already have the keys in our configuredKeys.
							const already = this.configuredKeys.findIndex((el) => el.host.uuid === elem.uuid)
							// If we already have it, update it
							if (already !== -1) {
								this.configuredKeys[already].host.uptime = elem.uptime
								this.configuredKeys[already].host.updated_at = elem.updated_at
								return
							}

							// Get the item and remove it from the array
							const rKey = this.keys.find((el) => el.host_uuid === elem.uuid)
							if (!rKey) return;

							// Push the server's info to the store
							this.configuredKeys.push({
								key: rKey,
								host: elem
							})
						})
						this.error = null
					}).catch((err) => {
						// TODO - Handle errors
						this.error = err
						console.log("fetchHostsAllBertas", err)
					})
			}
			this.initialLoading = false
		}
	}
})
