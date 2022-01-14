type TInstanceClass<TClass = any> = TClass;
type TClassConstruct<TClass = any> = {
	new (...args: any[]): TClass;
};
type TModuleOptions = {
	imports: (TClassConstruct | any)[];
	commands: TClassConstruct[];
	providers: TClassConstruct[];
	exports: TClassConstruct[];
};
