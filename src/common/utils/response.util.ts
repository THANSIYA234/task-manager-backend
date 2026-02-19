import { ErrorResponseDto } from "../dto/error-response-dto";
import { SuccessResponseDto } from "../dto/success-response-dto";

export class ApiResponse{
    static success<T=any>(message:string,data:T):SuccessResponseDto<T>{
        return {
            success:true,
            message,
            data
        }
    }
    static error(message:string,statusCode:number):ErrorResponseDto{
        return{
            success:false,
            message,
            statusCode
        }
    }
}