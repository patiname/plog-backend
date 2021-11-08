import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.output';
import { User } from '../entities/users.entity';

@ArgsType()
export class UserProfileInput {
  @Field((type) => Number)
  @IsNumber()
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
