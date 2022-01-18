import { MODULE_OPTIONS_METADATA } from "../src/constants";
import { Module } from "../src/models/module";
import { Provider } from "../src/models/provider";

describe("(Sub)Modules", () => {
	class UnregisteredRootModule {}
	class RootProvider {}
	class RootModule {}
	class Submodule {}

	let provider: Provider;
	let submodule: Module;

	const defineAllModules = (constructs: TClassConstruct[]) => {
		for (const construct of constructs) {
			Reflect.defineMetadata(MODULE_OPTIONS_METADATA, {}, construct);
		}
	};

	beforeAll(() => {
		defineAllModules([RootModule, Submodule]);

		provider = new Provider(RootProvider, false, undefined);
		submodule = Module.create(Submodule, [], [provider]);
	});

	it("should throw an error if called with unregistered module", () => {
		expect(() =>
			Module.create(UnregisteredRootModule, undefined, undefined)
		).toThrow(
			`The "UnregisteredRootModule" (sub)module didn't define in the system. Use decorator @Module to define your module.`
		);
	});

	it("should throw an error if called with null or undefined imported modules", () => {
		const errorMessage = "Imported submodules can't be null or undefined.";

		expect(() => Module.create(RootModule, undefined, undefined)).toThrow(
			errorMessage
		);
	});

	it("should throw an error if called without providers", () => {
		const errorMessage =
			"Providers of the module can't be empty or null / undefined.";

		expect(() => Module.create(RootModule, [], undefined)).toThrow(
			errorMessage
		);
		expect(() => Module.create(RootModule, [], [])).toThrow(errorMessage);
	});

	it.each([[], [submodule]])("should create the module", (...imports) => {
		const module = Module.create(RootModule, imports, [provider]);

		expect(module.construct).toBe(RootModule);
		expect(module.providers.length).toBe(1);
		expect(module.providers[0].construct).toBe(RootProvider);
	});
});
