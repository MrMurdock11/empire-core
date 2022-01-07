import { Commander, TUseCommanderHook } from "./commander";
import { Scanner } from "./scanner";
import { Injector } from "./injector";
import { Store } from "redux";

export let useCommander: TUseCommanderHook;

export class Factory {
	public static create(rootModule: TClassConstruct, store: Store): void {
		const scanner = new Scanner();
		scanner.scan(rootModule);
		const injector = new Injector(scanner, store);

		const commander = new Commander(injector, scanner);

		useCommander = () => ({
			commander,
		});
	}
}
