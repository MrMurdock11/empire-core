import { COMMAND_OPTIONS_METADATA } from "../constants";

export class Command {
	public get token(): string | undefined {
		return Reflect.getMetadata(COMMAND_OPTIONS_METADATA, this.construct)
			?.token;
	}

	public get available(): boolean {
		return Reflect.hasMetadata(COMMAND_OPTIONS_METADATA, this.construct);
	}

	constructor(public readonly construct: TClassConstruct) {}
}
