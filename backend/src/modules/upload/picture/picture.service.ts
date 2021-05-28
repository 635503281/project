import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { formatDate } from '../../../common/common';

const picturePath: string = path.join(process.cwd(), './picture');

@Injectable()
export class PictureService {
    async uploadPicture(data: string) {
        let base64Data: string = data.replace(/^data:image\/(\w+);base64,/, '');
        const format: string = RegExp.$1;
        var dataBuffer: Buffer = new Buffer(base64Data, 'base64');

        let isExist: boolean = await fs.existsSync(picturePath);
        if (!isExist) await fs.mkdirSync(picturePath);

        // 以天为目录
        let url: string = formatDate(new Date(), 'yyyy-MM-dd');
        url = path.join(picturePath, `./${url}`);

        // 以时间戳命名
        if (!(await fs.existsSync(url))) await fs.mkdirSync(url);
        url = path.join(url, `./${new Date().getTime()}.${format}`);

        return new Promise((resolve, reject) => {
            fs.writeFile(url, dataBuffer, err => {
                if (err) {
                    reject(err);
                    return;
                }
                // 返回路径格式 picture/yyyy-MM-dd/xx.png
                url = url.split(path.join(process.cwd(), '/'))[1];
                url = url.replace(/\\/g, '/');
                resolve({ url });
            });
        });
    }
}
