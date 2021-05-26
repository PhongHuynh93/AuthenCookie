import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationReqDto } from 'src/dto/registration.req.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository
    ) { }

    private async registrationValidation(regModel: RegistrationReqDto): Promise<string> {
        if (!regModel.email) {
            return "Email can't be empty";
        }

        const emailRule =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRule.test(regModel.email.toLowerCase())) {
            return 'Invalid email';
        }

        const user = await this.usersRepository.findOne({ email: regModel.email });
        if (user) {
            return 'Email already exist';
        }

        if (regModel.password !== regModel.confirmPassword) {
            return 'Confirm password not matching';
        }
        return '';
    }
}
