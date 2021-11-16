import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ select: false })
  @Length(3, 10)
  @IsString()
  password: string;

  @Field((type) => String)
  @Column()
  @IsString()
  nickname: string;

  @Field((type) => String, { nullable: true })
  @Column()
  @IsString()
  phoneNum?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      console.log(123);
      try {
        //유저가 작성한 비밀번호를 해시처리하기
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(inPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(inPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

// 1. id
// 2. email
// 3. password
// 4. create date
// 5. update date

// 1.entity
// 2.dto
// 3.resovler
// 4.service
