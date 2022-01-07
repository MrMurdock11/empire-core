import { COMMAND_OPTIONS_METADATA, INJECTABLE_METADATA } from "../constants";

export const Command =
	(token?: string): ClassDecorator =>
	target => {
		Reflect.defineMetadata(COMMAND_OPTIONS_METADATA, { token }, target);
		Reflect.defineMetadata(INJECTABLE_METADATA, {}, target);
	};
