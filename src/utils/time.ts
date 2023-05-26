import { DateTime, Duration, type DurationLikeObject } from "luxon";

export const SPS_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS";

export function isServerOnline (updated_at?: string) {
	if (!updated_at) return 1 // unknown
	if (DateTime.fromISO(updated_at, { zone: "UTC"}) <= DateTime.utc().minus({minutes: 5})) return 0 // offline
	return 2 // online
}


export function fmtDuration (durationinsec: number) {
	const duration = Duration.fromObject({ seconds: durationinsec });

	const durationKeys: Array<keyof DurationLikeObject> = ["days", "hours", "minutes", "seconds"];
	if (duration >= Duration.fromObject({ month: 1 })) {
		durationKeys.pop()
	}

	const vals = removeZeroes(
		duration
			.normalize()
			.shiftTo(...durationKeys)
			.toObject()
	);

	return Duration.fromObject(vals)
		.toHuman({ unitDisplay: "narrow", maximumFractionDigits: 0 })
		.replace(/,/g, '')
}

function removeZeroes(vals) {
	const newVals = {};

	for (const [key, value] of Object.entries(vals)) {
		if (value !== 0) {
			newVals[key] = value;
		}
	}

	return newVals;
}