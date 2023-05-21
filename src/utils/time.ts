import { DateTime, Duration } from "luxon";

export const SPS_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS";

export function isServerOnline (updated_at?: string) {
	if (!updated_at) return 1 // unknown
	if (DateTime.fromISO(updated_at, { zone: "UTC"}) <= DateTime.utc().minus({minutes: 5})) return 0 // offline
	return 2 // online
}


export function fmtDuration (durationinsec: number) {
	return Duration.fromMillis(durationinsec * 1000).rescale().toHuman({ unitDisplay: "short" }).replace(/,/g, '')
}