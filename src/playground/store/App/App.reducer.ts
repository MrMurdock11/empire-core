import { Keys } from "./App.keys";
import { Actions } from "./App.actions.type";
import { initState, State } from "./App.state";

export const app = (state = initState, action: Actions): State => {
	switch (action.type) {
		case Keys.SET_STATUS:
			return { ...state, status: action.status };
		default:
			return state;
	}
};
