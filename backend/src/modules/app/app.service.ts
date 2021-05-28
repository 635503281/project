import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AppService {
    constructor(private UserService: UserService) {}

    getHello(): string {
        return 'Hello World!';
    }

    //获取用户信息
    async getUserInfo(req): Promise<any> {
        const cookie = req.headers.cookie || '';
        const res = await this.UserService.getUserInfo(cookie);
        //没有登录
        if (res.result === 'no') {
            return res;
        }
        const { object } = res;
        let userID: number;
        try {
            const result: any = await this.UserService.findUser(object.user_id);
            const user: any = result.dataValues;
            //信息更改更新user
            if (object.avatar !== user.avatar || object.nickname !== user.nickname) {
                await this.UserService.update({ ...user, avatar: object.avatar, nickname: object.nickname });
            }
            userID = result.dataValues.user_id;
        } catch (e) {
            //没有用户新建一个用户
            if (e.status && e.status === 404) {
                const result: any = await this.UserService.create(object);
                userID = result.dataValues.user_id;
            }
        }
        //将用户id存入session
        userID && req.session.set('userID', userID);

        return res;
    }
}
