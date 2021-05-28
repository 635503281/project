import { IsString, IsNotEmpty, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateNoticeDto {
    @IsNotEmpty()
    @IsString()
    title: string; // 标题

    @IsString()
    @MaxLength(500)
    url: string = ''; // url

    @IsOptional()
    @IsNumber()
    user_id?: number; // user_id
}
