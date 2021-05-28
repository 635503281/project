import { Controller, Get, Request, Query, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { ErrorHttp } from '../../common/common';
import { IdsSearch } from './dto/idsSearch.dto';
import { TPostIdsType, Ids } from './user.interface';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * 获取用户信息
     * @param session
     */
    @Get('/statistics')
    getStatistics(@Session() session) {
        const userID: number = session.get('userID');
        if (!userID) {
            return new ErrorHttp(400, '未找到用户ID');
        }
        return this.userService.getStatistics(userID);
    }

    /**
     * 获取该用户发布post_id
     * @param search
     */
    @Get('/topic/ids')
    getPublishIds(@Query() search: IdsSearch, @Session() session): Promise<Ids> {
        const type: TPostIdsType = 'Publish';
        const userID: number = session.get('userID');
        search.user_id = userID;
        return this.userService.getPostIds(type, search);
    }

    /**
     * 获取该用户回复的post_id
     * @param search
     */
    @Get('/comment/topic/ids')
    getAnswerIds(@Query() search: IdsSearch, @Session() session): Promise<Ids> {
        const type: TPostIdsType = 'Answer';
        const userID: number = session.get('userID');
        search.user_id = userID;
        return this.userService.getPostIds(type, search);
    }

    /**
     * 获取该用户赞同的post_id
     * @param search
     */
    @Get('/approval/topic/ids')
    getApproveIds(@Query() search: IdsSearch, @Session() session): Promise<Ids> {
        const type: TPostIdsType = 'Approve';
        const userID: number = session.get('userID');
        search.user_id = userID;
        return this.userService.getPostIds(type, search);
    }
}
