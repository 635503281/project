import { IsString, IsNotEmpty, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    title: string; // 标题

    @IsString()
    @MaxLength(500)
    content: string = ''; // 内容

    @IsString()
    tag: string; //标签

    @IsOptional()
    @IsNumber()
    user_id?: number; // user_id
}
