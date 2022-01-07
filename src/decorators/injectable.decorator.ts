import { INJECTABLE_METADATA } from "../constants";

export const Injectable: ClassDecorator = target => {
	Reflect.defineMetadata(INJECTABLE_METADATA, {}, target);

	return target;
};
