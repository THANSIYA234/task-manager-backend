import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';


@Injectable()
export class CustomLogger  extends ConsoleLogger implements LoggerService{
    private formatedMsg(level:string,message:string,context?:string|object){
        const contextStr=context?typeof context==='object'?JSON.stringify(context):context:'NoContext'
        const timeStamp=new Date().toISOString();
        return `[${timeStamp}] [${level}] [${contextStr}] ${message}`;
    }
    log(message:string,context?:string){
       console.log(this.formatedMsg('LOG',message,context));
    };
    error(message:string,trace?:string,context?:string){
        console.error(this.formatedMsg('ERROR',message,context))
    };
    warn(message:string,context?:string){
        console.warn(this.formatedMsg('WARN',message,context))
    };
    debug(message: string, context?: string, ) {
       console.log(this.formatedMsg('DEBUG',message,context))
    };
}
