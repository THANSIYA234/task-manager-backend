import { ApiProperty } from "@nestjs/swagger";


export class SuccessResponseDto<T=any>{
    @ApiProperty({example:true })
    success:boolean;


    @ApiProperty({example:'operation successfully'})
    message:string;


    @ApiProperty({example:'null',required:false})
    data :T;
}
