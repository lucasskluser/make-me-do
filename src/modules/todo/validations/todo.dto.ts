import { IsString, IsUUID, IsBoolean } from 'class-validator'

/**
 * Objeto de transferência de dados de tarefa
 */
export class TodoDto {
    /**
     * Título da tarefa
     */
    @IsString()
    title: string;
}

/**
 * Objeto de transferência de dados de edição de tarefa
 */
export class TodoEditDto extends TodoDto {
    /**
     * Chave primária da tarefa
     */
    @IsUUID()
    id: string;

    /**
     * Flag de concluído da tarefa
     */
    @IsBoolean()
    done: boolean;
}