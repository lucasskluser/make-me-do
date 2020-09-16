import { IsString, IsUUID, IsBoolean } from 'class-validator'


export class TodoDto {
    @IsString()
    title: string;
}

export class TodoEditDto {
    @IsUUID()
    id: string;

    @IsString()
    title: string;

    @IsBoolean()
    done: boolean;
}