import moment from 'moment'

export function trunkKey (text) {
	if (text === null) return undefined

	return text.slice(0, 10)
}

export function fmtDuration (durationinsec) {
	return moment.duration(durationinsec, 'seconds').format('Y[y] M[m] D[d] HH[h] mm[m] ss[s]')
}

// Granularity can either be in minutes, seconds or in ms.
export function fmtGranularity (granularity) {
	if (!granularity) return 'unknown'

	if (granularity > 60000) {
		return Math.floor(granularity / 60000) + 'm ' + ((granularity % 60000) / 1000).toFixed(0) + 's'
	} else if (granularity > 1000) {
		return granularity / 1000 + 's'
	} else {
		return granularity + 'ms'
	}
}

export const FieldState = {
	None: 0,
	Success: 1,
	Error: 2,
	Empty: 3
}

/*
 * Return the appropriate style for the input based on the state
 */
export function getInputStyle (fieldState) {
	switch (fieldState) {
	case FieldState.Success:
		return 'input-success'
	case FieldState.Error:
		return 'input-error'
	case FieldState.Empty:
		return 'input-error'
	default:
		return ''
	}
}

export function validateEmail (email) {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
}

/*
 * Return the status of the server (online, unknown or offline)
 */
export function isServerOnline (updated_at) {
	if (!updated_at) return 1 // unknown
	if (moment.utc(updated_at).isBefore(moment.utc().subtract(5, 'minutes'))) return 0 // offline
	return 2 // online
}

export function computeGranularity (scale) {
	// Using ~ we convert the float to int once in it inversed form
	// Reusing ~ again we reverse it again and TADAAA not decimal
	return ~~((0.003 * scale) * 0.93 + 0.298206)
}