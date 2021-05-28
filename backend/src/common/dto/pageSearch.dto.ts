import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class PageSearch {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    page: number; //第几页

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    limit: number; //每页个数
}
