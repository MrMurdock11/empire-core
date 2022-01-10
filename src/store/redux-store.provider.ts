import { AnyAction, Store } from "redux";

/**
 * Поставщик хранилища из менеджера состояний.
 *
 * @export
 * @class ReduxStoreProvider
 * @template TState
 */
export class ReduxStoreProvider<TState> {
	constructor(private readonly _store: Store) {}

	/**
	 * Получает состояние из менеджера состояний.
	 *
	 * @readonly
	 * @type {TState}
	 * @memberof ReduxStoreProvider
	 */
	public get state(): TState {
		return this._store.getState();
	}

	/**
	 * Выполняет вызов действия для менеджера состояний.
	 *
	 * @param {AnyAction} action
	 * @memberof ReduxStoreProvider
	 */
	public dispatch = (action: AnyAction): AnyAction =>
		this._store.dispatch(action);
}
