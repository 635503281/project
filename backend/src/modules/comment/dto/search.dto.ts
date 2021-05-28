import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PageSearch } from 'src/common/dto/pageSearch.dto';

export class Search extends PageSearch {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number; //post_id

    @IsOptional()
    @IsString()
    order?: string; // 排序字段 默认降序DESC

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    parent_id?: number; // parent_id

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    user_id?: number; // user_id

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    replied_comment_id?: number; // replied_comment_id 直属上级comment_id
}
