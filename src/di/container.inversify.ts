import { Container as InversifyContainer } from "inversify";
import { DIContainer } from "__inversify-constants__";
import { Container } from "@di/container";
import { IContainer } from "@di/container.interface";

const configureContainer = () => {
	const container = new InversifyContainer();

	container.bind<IContainer>(DIContainer).to(Container).inSingletonScope();
};
const container = configureContainer();

export { container };
