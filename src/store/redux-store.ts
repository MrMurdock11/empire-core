import { AnyAction, Store } from "redux";

export class ReduxStore<TState> {
	constructor(private readonly _store: Store) {}

	public get state(): TState {
		return this._store.getState();
	}

	public dispatch = (action: AnyAction): AnyAction =>
		this._store.dispatch(action);
}
