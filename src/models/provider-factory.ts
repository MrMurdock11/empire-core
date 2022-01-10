import { Provider } from "./provider";

export class ProviderFactory extends Provider {
	constructor(
		public readonly construct: TClassConstruct,
		public readonly exportable: boolean,
		public readonly useFactory: () => TInstanceClass<any>
	) {
		super(construct, exportable);
	}
}
