import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ValidationError } from 'sequelize';
import { ValidationErrorItem } from 'sequelize/types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    let message:string = new InternalServerErrorException().message;
    let errors: string[] = [message]
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    console.log('exception', exception);
    // http相关错误信息
    if (exception instanceof HttpException) {
      message = exception.message;
      exception.getStatus() && (status = exception.getStatus());
      errors = (exception?.getResponse() as any).message;
      if (!Array.isArray(errors)) {
        errors = [errors];
      }
    // 数据库验证错误信息
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = new BadRequestException().message;
      errors = exception.errors.map((error: ValidationErrorItem) => error.message);
    }

    // 自定义错误格式
    const errorResponse = {
      result: this.getResultFromMessage(message),
      url: request.url,
      message,
      errors,
    };

    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
  private getResultFromMessage(message: string) {
    return message.replace(/\s/g, '').replace(/^\S/, s => s.toLowerCase())
  }
}