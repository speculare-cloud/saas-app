import type { AlertsDTO } from "@martichou/sproot";
import type { ConfiguredKeys } from "./ConfiguredKeys";

interface DupAlert {
	k: ConfiguredKeys,
	a: AlertsDTO
}