import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PageSearch } from 'src/common/dto/pageSearch.dto';

export class IdsSearch extends PageSearch {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    user_id?: number; //user_id
}
