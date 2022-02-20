import { injectable } from "inversify";
import { IContainer } from "@di/container.interface";

@injectable()
export class Container implements IContainer {
	private readonly _dictionary = new Map<TConstruct | string, any>();

	get<TInstance>(construct: TConstruct<TInstance> | string): TInstance {
		return this._dictionary.get(construct);
	}

	register(construct: TConstruct): void;
	register(key: string, construct: TConstruct): void;
	register(...args: [TConstruct] | [string, TConstruct]) {
		if (args.length >= 2) {
			const [key, construct] = args;

			this._dictionary.set(key, construct);
		} else {
			const construct = args[0];

			this._dictionary.set(construct, construct);
		}
	}
}
