import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOuput,
} from './dto/createAccount.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    phoneNum,
    nickname,
  }: CreateAccountInput): Promise<CreateAccountOuput> {
    try {
      // 1.아이디 중복 확인
      // 2.있는 아이디면 ~
      // 3.디비에 저장

      const existUser = await this.users.findOne({ email });
      if (existUser) {
        return { ok: false, error: '이미 존재하는 아이디 입니다.' };
      }

      await this.users.save(
        this.users.create({ email, password, phoneNum, nickname }),
      );

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '회원가입을 할수 없습니다.' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return { ok: false, error: '없는 유저 입니다.' };
      }

      const passwordOk = await user.checkPassword(password);
      // console.log(passwordOk);
      if (!passwordOk) {
        return { ok: false, error: '패스워드가 틀렸습니다.' };
      }

      const token = this.jwtService.sign(user.id);
      // console.log(token);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return { ok: false, error: '로그인을 할 수 없습니다.' };
    }
  }
}

// 로그인 -> 유저가 맞을때 -> 토큰 발급 -> 내사이트에서 권한 행사
//         유저가 아닐때 /
