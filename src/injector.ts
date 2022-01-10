import { Store } from "redux";
import { IScanner } from "./scanner";
import { ReduxStoreProvider } from "./store/redux-store.provider";
import { TProviderFactory } from "./types/provider-factory.type";

export class Injector extends Map<
	TClassConstruct,
	TInstanceClass<any> | TClassConstruct
> {
	private readonly paramTypes = "design:paramtypes";

	constructor(private readonly _scanner: IScanner, store: Store) {
		super();
		this.initialize(store);
	}

	private initialize(reduxStore: Store): void {
		this.set(ReduxStoreProvider, new ReduxStoreProvider(reduxStore));
	}

	public resolve = (
		target: TClassConstruct
	): TInstanceClass<any> | undefined => this.lazy(target);

	private lazy(
		target: TClassConstruct,
		parent: TClassConstruct | null = null
	): TInstanceClass<any> | undefined {
		const construct = target;

		const canInject =
			parent !== null && !this._scanner.canInject(construct, parent);
		if (canInject) {
			console.log(
				`"${construct.prototype.constructor.name}" couldn't resolve.`
			);
			return void 0;
		}

		const resolvedInstance = this.get(construct);
		if (resolvedInstance) {
			return resolvedInstance;
		}

		const injections = this.defineInjections(construct);
		const instance = new construct(...injections);
		this.set(construct, instance);

		console.log(
			`DI-Container created instance: "${instance.constructor.name}"`
		);

		return instance;
	}

	private defineInjections(
		target: TClassConstruct
	): TInstanceClass<any> | undefined {
		const params: TClassConstruct[] =
			Reflect.getMetadata(this.paramTypes, target) || [];
		const injections = params.map(param => this.lazy(param, target));

		return injections;
	}
}
