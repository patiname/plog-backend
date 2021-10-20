import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.output';
import { User } from '../entities/users.entity';

@InputType()
export class CreateAccountInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class CreateAccountOuput extends CoreOutput {}
