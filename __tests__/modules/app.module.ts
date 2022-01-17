import { Module } from "../../src/decorators/module.decorator";
import { ProjectsModule } from "./projects/projects.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [ProjectsModule, UsersModule],
})
export class AppModule {}
