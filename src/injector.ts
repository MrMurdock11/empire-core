import { Store } from "redux";
import { IScanner } from "./scanner";
import { ReduxStore } from "./store/redux-store";

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
		this.set(ReduxStore, new ReduxStore(reduxStore));
	}

	public resolve = (
		target: TClassConstruct
	): TInstanceClass<any> | undefined => this.lazy(target);

	private lazy(
		target: TClassConstruct,
		parent: TClassConstruct | null = null
	): TInstanceClass<any> | undefined {
		const canInject =
			parent !== null && !this._scanner.canInject(target, parent);
		if (canInject) {
			console.log(
				`"${target.prototype.constructor.name}" couldn't resolve.`
			);
			return void 0;
		}

		const resolvedInstance = this.get(target);
		if (resolvedInstance) {
			return resolvedInstance;
		}

		const injections = this.defineInjections(target);
		const instance = new target(...injections);
		this.set(target, instance);

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
