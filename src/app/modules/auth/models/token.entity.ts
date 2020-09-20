import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@user/models/user.entity';

export enum TokenType {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
}

/**
 * Entidade que representa um Token
 */
@Entity('tokens')
export class Token {
  /**
   * Chave primária do token
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Valor do token
   */
  @Column({ unique: true, nullable: false })
  value: string;

  /**
   * Tipo do token
   */
  @Column({
    enum: TokenType,
    default: TokenType.REFRESH_TOKEN,
    nullable: false,
  })
  type: TokenType;

  /**
   * Audiência do token
   */
  @Column({ nullable: false })
  audience: string;

  /**
   * Data de geração do token
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data de atualização do token
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relacionamento many-to-one entre os tokens e seu usuário
   */
  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    cascade: true,
  })
  user: User;
}
