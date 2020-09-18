import { IsString, IsUUID, IsBoolean } from 'class-validator'


export class TodoDto {
    @IsString()
    title: string;
}

export class TodoEditDto extends TodoDto {
    @IsUUID()
    id: string;

    @IsBoolean()
    done: boolean;
}