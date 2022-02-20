export interface IContainer {
	get<TInstance>(target: TConstruct<TInstance> | string): TInstance;

	register(construct: TConstruct): void;
	register(key: string, construct: TConstruct): void;
}
