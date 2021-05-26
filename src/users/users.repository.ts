import { User } from './user';
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt)
    }
}