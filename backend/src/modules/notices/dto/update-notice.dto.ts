import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateNoticeDto } from './create-notice.dto';

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number; // id
}
