import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    access_token: string;
}
