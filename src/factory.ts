import { Commander, TUseCommanderHook } from "./commander";
import { Scanner } from "./scanner";
import { Injector } from "./injector";

export let useCommander: TUseCommanderHook;

export class Factory {
	public static create(rootModule: TClassConstruct): void {
		const scanner = new Scanner();
		scanner.scan(rootModule);
		const injector = new Injector(scanner);

		const commander = new Commander(injector, scanner);

		useCommander = () => ({
			commander,
		});
	}
}
