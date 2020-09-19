import {
  Entity,
  PrimaryColumn,
  Generated,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@modules/user/models/user.entity';

export enum TokenType {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
}

/**
 * Entidade que representa um Token
 */
@Entity()
export class Token {
  /**
   * Chave primária do token
   */
  @PrimaryColumn()
  @Generated('uuid')
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
   * Chave estrangeira do usuário do token
   */
  @Column({ nullable: false })
  userId: string;

  /**
   * Relacionamento many-to-one entre os tokens e seu usuário
   */
  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    cascade: true,
  })
  @JoinColumn()
  user: User;
}
