import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOuput,
} from './dto/createAccount.dto';
import { EditProfileInput, EditProfileOutput } from './dto/editProfile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UserProfileOutput } from './dto/userProfile.dto';
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
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (!user) {
        return { ok: false, error: '유저를 찾을 수 없습니다.' };
      }

      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: '없는 유저 입니다.' };
    }
  }

  async editProfile(
    id: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (!user) {
        return { ok: false, error: '없는 유저 입니다.' };
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        user.password = password;
      }

      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: '수정할 수 없습니다.' };
    }
  }
}
