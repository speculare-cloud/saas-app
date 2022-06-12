import moment from 'moment';

export function trunkKey(text) {
	if (text === null) return undefined

	return text.slice(0, 6);
}

export function fmtDuration(durationinsec) {
	return moment.duration(durationinsec, 'seconds').format();
}

export function fmtGranularity(granularity) {
	if (granularity > 1000) {
		return granularity / 1000 + "s";
	} else {
		return granularity + "ms";
	}
}