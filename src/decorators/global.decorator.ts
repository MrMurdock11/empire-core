import { GLOBAL_METADATA } from "../constants";

export const Global: ClassDecorator = target => {
	Reflect.defineMetadata(GLOBAL_METADATA, {}, target);

	return target;
};
