import moment from 'moment'

export function trunkKey (text) {
	if (text === null) return undefined

	return text.slice(0, 10)
}

export function fmtDuration (durationinsec) {
	return moment.duration(durationinsec, 'seconds').format('Y[y] M[m] D[d] HH[h] mm[m] ss[s]')
}

export function fmtGranularity (granularity) {
	if (granularity > 1000) {
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

export function getInputStyle (field) {
	switch (field) {
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
