import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Model } from 'sequelize-typescript';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (data && typeof data === 'object' && !Array.isArray(data)) {
                    !data.result && (data.result = 'ok');

                    //处理返回单独的对象
                    if (data.__proto__ instanceof Model) {
                        const res: any = {
                            result: 'ok',
                            object: data.dataValues,
                        };
                        data.id && (res.id = data.id);
                        return res;
                    }
                } else if (!data) {
                    return { result: 'ok' };
                }
                return data;
            }),
        );
    }
}
