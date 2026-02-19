import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDto<T=any>{
    @ApiProperty({example:false})
    success:boolean;

    @ApiProperty({example:404})
    statusCode:number;

    @ApiProperty({example:'validation failed'})
    message:string
}