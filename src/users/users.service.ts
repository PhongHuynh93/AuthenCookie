import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationReqDto } from 'src/dto/registration.req.dto';
import { UsersRepository } from './users.repository';
import { RegistrationRespDto } from '../dto/registration.resp.dto';
import * as bcrypt from 'bcrypt'
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository
    ) { }

    async registerUser(
        regModel: RegistrationReqDto,
    ): Promise<RegistrationRespDto> {
        let result = new RegistrationRespDto();

        const errorMessage = await this.registrationValidation(regModel);
        if (errorMessage) {
            result.message = errorMessage;
            result.successStatus = false;

            return result;
        }

        const salt = await bcrypt.genSalt()
        let newUser = new User();
        newUser.firstName = regModel.firstName;
        newUser.lastName = regModel.lastName;
        newUser.email = regModel.email;
        newUser.salt = salt;
        newUser.password = await this.usersRepository.hashPassword(regModel.password, salt);

        await this.usersRepository.insert(newUser);
        result.successStatus = true;
        result.message = 'success';
        return result;
    }

    private async registrationValidation(regModel: RegistrationReqDto): Promise<string> {
        if (regModel.password !== regModel.confirmPassword) {
            return 'Confirm password not matching';
        }

        const user = await this.usersRepository.findOne({ email: regModel.email });
        if (user) {
            return 'Email already exist';
        }

        return '';
    }
}
