import {
  Entity,
  PrimaryColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * Entidade Usuário
 */
@Entity()
export class User {
  /**
   * Chave primária do usuário
   */
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  /**
   * Nome do usuário
   */
  @Column()
  name: string;

  /**
   * Email do usuário
   */
  @Column({ unique: true })
  email: string;

  /**
   * Senha do usuário
   */
  @Column({ select: false })
  @Exclude()
  password: string;

  /**
   * Data de criação do usuário
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data de atualização do usuário
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Data de deleção do usuário
   */
  @DeleteDateColumn({ nullable: true, select: false })
  @Exclude()
  deletedAt: Date;
}
