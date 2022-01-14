import { Commander, TUseCommanderHook } from "./commander";
import { Scanner } from "./scanner";
import { Injector } from "./injector";

let commander: Commander | undefined;
const useCommander: TUseCommanderHook = () => ({ commander });

class Factory {
	public static create(rootModule: TClassConstruct): void {
		const scanner = new Scanner();
		scanner.scan(rootModule);
		const injector = new Injector(scanner);

		commander = new Commander(injector, scanner);
	}
}

export { Factory, useCommander };
