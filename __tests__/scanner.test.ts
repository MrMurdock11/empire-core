import { IScanner, Scanner } from "../src/scanner";
import { AppModule } from "./modules/app.module";
import { ProjectsService } from "./modules/projects/projects.service";

describe("Scanner", () => {
	let scanner: IScanner;

	beforeAll(() => {
		scanner = new Scanner();
	});

	it("Should scan module tree", () => {
		scanner.scan(AppModule);

		expect(scanner.scan).toBeCalled();
	});

	it("Should find provider", () => {
		const provider = scanner.findProvider(ProjectsService);

		expect(ProjectsService).toBe(provider.construct);
	});
});
