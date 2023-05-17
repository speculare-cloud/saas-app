import { DateTime, Duration } from "luxon"

export function trunkKey (text?: string) {
	if (!text) return undefined

	return text.slice(0, 10)
}

export function fmtDuration (durationinsec: number) {
	return Duration.fromMillis(durationinsec * 1000).rescale().toHuman({ unitDisplay: "short" })
}

// Granularity can either be in minutes, seconds or in ms.
export function fmtGranularity (granularity?: number) {
	if (!granularity) return 'unknown'

	if (granularity > 60000) {
		return Math.floor(granularity / 60000) + 'm ' + ((granularity % 60000) / 1000).toFixed(0) + 's'
	} else if (granularity > 1000) {
		return granularity / 1000 + 's'
	} else {
		return granularity + 'ms'
	}
}

export enum FieldState {
	None = 0,
	Success,
	Error,
	Empty
}

/*
 * Return the appropriate style for the input based on the state
 */
export function getInputStyle (fieldState: FieldState) {
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

export function validateEmail (email: string) {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
}

/*
 * Return the status of the server (online, unknown or offline)
 */
export function isServerOnline (updated_at?: string) {
	if (!updated_at) return 1 // unknown
	if (DateTime.fromISO(updated_at, { zone: "UTC"}) <= DateTime.utc().minus({minutes: 5})) return 0
	return 2 // online
}

export function computeGranularity (scale: number) {
	// Using ~ we convert the float to int once in it inversed form
	// Reusing ~ again we reverse it again and TADAAA not decimal
	return ~~((0.003 * scale) * 0.93 + 0.298206)
}

export function opt<T>(v?: T) {
	return v ?? null;
}
