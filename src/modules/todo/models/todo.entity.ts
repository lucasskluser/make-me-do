import {
  Entity,
  PrimaryColumn,
  Column,
  Generated,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@modules/user/models/user.entity';

/**
 * Entidade que representa uma tarefa
 */
@Entity()
export class Todo {
  /**
   * Chave primária da tarefa
   */
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  /**
   * Título da tarefa
   */
  @Column()
  title: string;

  /**
   * Flag de concluído da tarefa
   */
  @Column({ default: false })
  done: boolean;

  /**
   * Data de criação da tarefa
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data de atualização da tarefa
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relacionamento many-to-one entre as tarefas e seu usuário
   */
  @ManyToOne(type => User, {
    onDelete: 'RESTRICT',
    cascade: true,
  })
  user: User;
}
