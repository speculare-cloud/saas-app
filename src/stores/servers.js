import { defineStore } from 'pinia'

export const useServersStore = defineStore('servers', {
	state: () => {
		return {
			// List of different Bertas hosted user's servers
			bertas: new Map(),
			// Raw keys from /api/key
			keys: [],
			// List of owned keys by the user with info from Bertas.
			unconfiguredKeys: [],
			// List of owned keys + hostname and basics info of the server
			configuredKeys: []
		}
	},
	actions: {
		async fetchSpecificHost (vm, keyObj) {
			return await vm.$http.get(vm.$serverBase(keyObj.berta) + '/api/host?uuid=' + keyObj.host_uuid)
				.then((resp) => {
					const hostObj = {
						system: resp.data.system,
						os_version: resp.data.os_version,
						hostname: resp.data.hostname,
						uptime: resp.data.uptime,
						uuid: resp.data.uuid,
						created_at: resp.data.created_at
					}

					const newObj = {
						hostname: hostObj.hostname,
						uptime: hostObj.uptime,
						key: keyObj.key,
						uuid: hostObj.uuid,
						berta: keyObj.berta,
						granularity: keyObj.granularity
					}

					// Check if we already have the keys in our configuredKeys.
					const alreadyIndex = this.configuredKeys.findIndex((obj) => obj.uuid === hostObj.uuid)
					if (alreadyIndex === -1) {
						this.configuredKeys.push(newObj)
					} else {
						this.configuredKeys[alreadyIndex] = newObj
					}
				}).catch(async (err) => {
					if (err.response && err.response.status === 404) {
						return true
					}
					// TODO - Handle errors
					console.log(err)
				})
		},
		async fetchApiKeysAndBertas (vm) {
			// Fetch the API keys for the current user
			await vm.$http.get(vm.$authBase + '/api/key')
				.then((resp) => {
					resp.data.forEach(elem => {
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

						const keyObj = {
							key: elem.key,
							uuid: elem.host_uuid,
							berta: elem.berta,
							granularity: 3000
						}

						if (!this.keys.some((el) => el.key === elem.key)) {
							this.keys.push(keyObj)
						}

						// remove the element from the unconfiguredKeys if exists and is configured
						if (elem.host_uuid !== null) {
							const index = this.unconfiguredKeys.findIndex((el) => el.key === elem.key)
							if (index !== -1) this.unconfiguredKeys.splice(index, 1)
						} else {
							if (!this.unconfiguredKeys.some((el) => el.key === elem.key)) {
								this.unconfiguredKeys.push(keyObj)
							}
						}
					})
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err)
				})
		},
		async fetchHostsAllBertas (vm) {
			for (const berta of this.bertas.keys()) {
				await vm.$http.get(vm.$serverBase(berta) + '/api/hosts')
					.then((resp) => {
						// Foreach server we got as response
						resp.data.forEach(elem => {
							// console.log("Checking for configuredKeys", elem.uuid);

							// Check if we already have the keys in our configuredKeys.
							const already = this.configuredKeys.find((el) => el.uuid === elem.uuid)
							// If we already have it, skip
							if (already !== undefined) {
								return
							}

							// Get the item and remove it from the array
							const rKey = this.keys.find((el) => el.uuid === elem.uuid)
							// Push the server's info to the store
							this.configuredKeys.push({
								hostname: elem.hostname,
								uptime: elem.uptime,
								key: rKey.key,
								uuid: rKey.uuid,
								berta: rKey.berta,
								granularity: rKey.granularity
							})
						})
					}).catch((err) => {
						// TODO - Handle errors
						console.log(err)
					})
			}
		}
	}
})
