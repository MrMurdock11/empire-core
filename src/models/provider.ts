export class Provider {
	constructor(
		public readonly construct: TClassConstruct,
		public readonly exportable: boolean
	) {}
}
