import { HttpException } from '@nestjs/common';
import { IObject } from './interface/interface';

/**
 * 格式化时间
 * @param date
 * @param fmt
 */
export function formatDate(date: Date, fmt: string = 'yyyy-MM-dd HH:mm:ss'): string {
    let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'H+': date.getHours(), //小时(24小时制)
        'h+': date.getHours() >= 12 ? date.getHours() - 12 : date.getHours(), //小时(12小时制)
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
    return fmt;
}

/**
 * statuCode: 200
 * result: no响应
 */
export class NoRes {
    message: string;
    result: string = 'no';
    [propName: string]: any;
    constructor(msg: string = '错误') {
        this.message = msg;
    }
}

/**
 * statuCode: 200
 * result: ok
 */
export class OkRes {
    result: string = 'ok';
    [propName: string]: any;
    constructor(type: string, data: IObject | Array<any>) {
        if (type === 'object') {
            this.object = data;
        } else if (type === 'list') {
            for (let key in data) {
                this[key] = data[key];
            }
        } else if (type === 'array') {
            this.rows = data;
        }
    }
}

/**
 * 错误状态码响应
 */
export class ErrorHttp {
    constructor(code: number = 400, msg: string = '错误') {
        const httpException: HttpException = new HttpException(
            {
                message: msg,
                status: code,
            },
            code,
        );
        return httpException;
    }
}

type TCountType = 'add' | 'reduce';
/**
 * 更新的model的某个字段的数量
 * @param type -- 类型 'add'|'reduce'
 * @param field -- 修改字段
 * @param model -- 模型
 */
export async function updateModelCount(type: TCountType, field: string, model: any) {
    //更新字段
    const obj = { [field]: model.dataValues[field] + 1 };
    if (type === 'reduce') {
        obj[field] = Math.max(model.dataValues[field] - 1, 0);
    }
    return await model.update({ ...model.dataValues, ...obj });
}
