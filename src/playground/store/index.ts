import { combineReducers } from "redux";
import { app } from "./App/App.reducer";

export const rootReducer = combineReducers({
	app,
});

export type AppState = ReturnType<typeof rootReducer>;
