import { Module } from '@nestjs/common';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { noticeProviders } from './notices.providers';

@Module({
    controllers: [NoticesController],
    providers: [NoticesService, ...noticeProviders],
})
export class NoticesModule {}
