import { IsString, IsNotEmpty, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @MaxLength(500)
    content: string = ''; // 内容

    @IsNumber()
    topic_id: number; //post的id

    @IsOptional()
    @IsNumber()
    replied_user_id?: number; //回复者id

    @IsOptional()
    @IsNumber()
    replied_comment_id?: number; //回复comment的id

    @IsOptional()
    @IsNumber()
    user_id?: number; //use_id
}
