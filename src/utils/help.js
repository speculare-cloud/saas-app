export function trunkKey(text) {
	if (text === null) return undefined

	return text.slice(0, 6);
}