import { Container } from "@di/container";
import { IContainer } from "@di/container.interface";

describe("dependency injection container", () => {
	class Controller {}

	class Service {}

	class Provider {}

	describe("register into container", () => {
		let container: IContainer;

		beforeAll(() => {
			container = new Container();
		});

		it("should register class", () => {
			container.register(Controller);
			container.register("service", Service);

			expect(container.get(Controller)).toBe(Controller);
			expect(container.get("service")).toBe(Service);
		});
	});
});
