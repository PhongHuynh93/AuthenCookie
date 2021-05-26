import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrationReqDto } from '../dto/registration.req.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post('registration')
    registerUser(@Body(ValidationPipe) reg: RegistrationReqDto) {
        return this.userService.registerUser(reg);
    }
}
