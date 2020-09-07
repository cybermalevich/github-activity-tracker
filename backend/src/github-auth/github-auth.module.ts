import {Module} from '@nestjs/common';
import {GithubAuthService} from './github-auth.service';
import {GithubAuthController} from './github-auth.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
    providers: [GithubAuthService],
    controllers: [GithubAuthController],
    imports: [AuthModule],
    exports: [GithubAuthService]
})
export class GithubAuthModule {
}
