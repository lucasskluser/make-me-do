import {
  Entity,
  PrimaryColumn,
  Column,
  Generated,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@modules/user/models/user.entity';

@Entity()
export class Todo {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: false })
  done: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  /**
   * Relacionamento many-to-one entre os todos e seu usuário
   */
  @ManyToOne(type => User, {
    onDelete: 'RESTRICT',
    cascade: true,
  })
  user: User;
}
