type TInstanceClass<TClass> = TClass;
type TClassConstruct<TClass = any> = {
	new (...args: any[]): TClass;
};
type TModuleOptions = {
	imports: TClassConstruct[];
	commands: TClassConstruct[];
	providers: TClassConstruct[];
	exports: TClassConstruct[];
};
