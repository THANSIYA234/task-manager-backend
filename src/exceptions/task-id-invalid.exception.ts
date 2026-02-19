import { HttpException, HttpStatus } from "@nestjs/common";

export class TaskIdInvalidException extends HttpException{
    constructor(id:string){
        super(`this is an invalid task id:${id}`,HttpStatus.BAD_REQUEST)
    }
}