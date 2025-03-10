import { IsEmail, IsString } from 'class-validator';

export class UsersDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
