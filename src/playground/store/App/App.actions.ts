import { Keys } from "./App.keys";

/* eslint-disable @typescript-eslint/explicit-function-return-type */

export const setStatus = (status: string) => {
	return {
		type: Keys.SET_STATUS,
		status,
	} as const;
};
