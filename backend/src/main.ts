require('dotenv').config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { AppModule } from './modules/app/app.module';
import secureSession from 'fastify-secure-session';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.setGlobalPrefix('/comm/api/v1');
    app.register(secureSession, { secret: 'averylogphrasebiggerthanthirtytwochars', salt: 'mq9hDxBVDbspDR6n' });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // 设置图片静态资源目录
    app.useStaticAssets({
        root: path.join(process.cwd(), './picture'),
        prefix: '/comm/picture',
    });

    await app.listen(3000, '0.0.0.0');
}
bootstrap();
