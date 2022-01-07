import { PROVIDER_OPTIONS_METADATA } from "../constants";

export class Provider {
	public get available(): boolean {
		return Reflect.hasMetadata(PROVIDER_OPTIONS_METADATA, this.construct);
	}

	constructor(
		public readonly construct: TClassConstruct,
		public readonly exportable: boolean
	) {}
}
