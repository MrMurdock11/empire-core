export type TProviderFactory = {
	construct: TClassConstruct;
	useFactory: () => TInstanceClass<any>;
};
