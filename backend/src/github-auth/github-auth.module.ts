import {Module} from '@nestjs/common';
import {GithubAuthService} from './github-auth.service';
import {GithubAuthController} from './github-auth.controller';

@Module({
    providers: [GithubAuthService],
    controllers: [GithubAuthController],
    exports: [GithubAuthService]
})
export class GithubAuthModule {
}
