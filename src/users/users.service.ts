import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOuput,
} from './dto/createAccount.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
  }: CreateAccountInput): Promise<CreateAccountOuput> {
    try {
      // 1.아이디 중복 확인
      // 2.있는 아이디면 ~
      // 3.디비에 저장

      const existUser = await this.users.findOne({ email });
      if (existUser) {
        return { ok: false, error: '이미 존재하는 아이디 입니다.' };
      }

      await this.users.save(this.users.create({ email, password }));

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '회원가입을 할수 없습니다.' };
    }
  }
}
