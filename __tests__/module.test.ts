import { MODULE_OPTIONS_METADATA } from "../src/constants";
import { Global } from "../src/decorators/global.decorator";
import { Module } from "../src/models/module";
import { Provider } from "../src/models/provider";
import { Module as ModuleMetadata } from "../src/decorators/module.decorator";

describe("Modules", () => {
	// Modules
	class UnregisteredRootModule {}

	@ModuleMetadata()
	class RootModule {}

	@ModuleMetadata()
	class Submodule {}

	@Global
	@ModuleMetadata()
	class GlobalModule {}

	// Providers
	class InnerProvider {}
	class NotInnerProvider {}

	const defineAllModules = (constructs: TClassConstruct[]) => {
		for (const construct of constructs) {
			Reflect.defineMetadata(MODULE_OPTIONS_METADATA, {}, construct);
		}
	};

	describe("Module.create()", () => {
		let provider: Provider;
		let submodule: Module;

		beforeAll(() => {
			provider = new Provider(InnerProvider, false, undefined);
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
			expect(() =>
				Module.create(RootModule, undefined, undefined)
			).toThrow("Imported submodules can't be null or undefined.");
		});

		it("should throw an error if called without providers", () => {
			const errorMessage =
				"Providers of the module can't be null or undefined.";

			expect(() => Module.create(RootModule, [], undefined)).toThrow(
				errorMessage
			);
			expect(() => Module.create(RootModule, [], null)).toThrow(
				errorMessage
			);
		});

		it.each([[], [submodule]])("should create the module", (...imports) => {
			const module = Module.create(RootModule, imports, [provider]);

			expect(module.construct).toBe(RootModule);
			expect(module.providers.length).toBe(1);
			expect(module.providers[0].construct).toBe(InnerProvider);
		});
	});

	describe("contains()", () => {
		let provider: Provider;
		let module: Module;

		beforeAll(() => {
			provider = new Provider(InnerProvider, false, undefined);
			module = Module.create(RootModule, [], [provider]);
		});

		it("should define the module contains a provider", () => {
			expect(module.contains(InnerProvider)).toBeTruthy();
		});

		it("should define the module don't contains a provider", () => {
			expect(module.contains(NotInnerProvider)).toBeFalsy();
		});
	});

	describe("global()", () => {
		it("should define that the module scope is global", () => {
			const module = Module.create(GlobalModule, [], []);

			expect(module.global).toBeTruthy();
		});

		it("should define that the module scope is basic", () => {
			const module = Module.create(RootModule, [], []);

			expect(module.global).toBeFalsy();
		});

		it("should use cached value in second get value from field", () => {
			const module = Module.create(RootModule, [], []);

			expect(module.global).toBeFalsy();
			expect(module.global).toBeFalsy();
		});
	});
});
