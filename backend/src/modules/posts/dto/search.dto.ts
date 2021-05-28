import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PageSearch } from 'src/common/dto/pageSearch.dto';

export class Search extends PageSearch {
    @IsOptional()
    @IsString()
    keyword?: string; // 搜索关键字

    @IsOptional()
    @IsString()
    tag?: string; // 各类tag

    @IsOptional()
    @IsString()
    order?: string; // 排序字段 默认降序DESC

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    recent?: number; // 查询的天数
}
