import { MODULE_OPTIONS_METADATA } from "../constants";
import { Command } from "./command";
import { Provider } from "./provider";

export class Module {
	public get available(): boolean {
		return Reflect.hasMetadata(MODULE_OPTIONS_METADATA, this.construct);
	}

	constructor(
		public readonly construct: TClassConstruct,
		public readonly imports: Module[],
		public readonly commands: Command[],
		public readonly providers: Provider[]
	) {}

	public has(construct: TClassConstruct): boolean {
		return [
			...this.commands.map(c => c.construct),
			...this.providers.map(p => p.construct),
		].includes(construct);
	}
}
