import { HttpException, HttpStatus } from "@nestjs/common";


export class TaskInvalidStatusException extends HttpException{
    constructor(status:string){
        super(`Task status ${status}is invalid ,`,HttpStatus.BAD_REQUEST)
    }
}