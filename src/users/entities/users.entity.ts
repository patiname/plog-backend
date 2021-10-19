import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@InputType()
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  email: string;

  @Field((type) => String)
  @Column()
  @IsString()
  password: string;
}

// 1. id
// 2. email
// 3. password
// 4. create date
// 5. update date
