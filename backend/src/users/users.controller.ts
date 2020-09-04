import {Body, Controller, Get, Post} from '@nestjs/common';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {UsersService} from "./users.service";
import {getManager} from "typeorm";
import {User} from "../entities/user.entity";

@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) { }

    @Post('create')
    async create(@Body() body: CreateUserDto) {
        const entityManager = getManager();
        await entityManager.insert(User, body);
    }
}
