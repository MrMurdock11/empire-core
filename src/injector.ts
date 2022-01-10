import { ProviderFactory } from "./models/provider-factory";
import { IScanner } from "./scanner";

export class Injector extends Map<
	TClassConstruct,
	TInstanceClass<any> | TClassConstruct
> {
	private readonly paramTypes = "design:paramtypes";

	constructor(private readonly _scanner: IScanner) {
		super();
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

		const provider = this._scanner.findProvider(construct);
		let instance;
		if (provider instanceof ProviderFactory) {
			instance = provider.useFactory();
		} else {
			const injections = this.defineInjections(construct);
			instance = new construct(...injections);
			this.set(construct, instance);
		}

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
