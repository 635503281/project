import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsString()
    nickname: string;

    @IsString()
    avatar: string;
}
