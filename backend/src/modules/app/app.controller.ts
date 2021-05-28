import { Controller, Get, Request, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    index(): string {
        return '问答社区API';
    }

    //获取用户信息
    @Get('/login_info')
    async getUserInfo(@Request() req): Promise<any> {
        return this.appService.getUserInfo(req);
    }
}
