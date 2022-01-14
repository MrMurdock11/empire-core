export type TModuleOptions = Partial<{
	imports: TClassConstruct[];
	commands: TClassConstruct[];
	providers: TClassConstruct[];
	exports: TClassConstruct[];
}>;
