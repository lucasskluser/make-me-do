import { Injectable } from '@nestjs/common';
import {
  UserDto,
  UserCreateDto,
  UserUpdatePasswordDto,
} from '@modules/user/validations/user.dto';
import { Repository } from 'typeorm';
import { User } from '@modules/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, createHmac } from 'crypto';

/**
 * Serviço de manipulação de usuário
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Obtém um usuário pelo ID
   * @param id ID do usuário
   */
  async get(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  /**
   * Obtém um usuário pelo email
   * @param email Email do usuário
   */
  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  /**
   * Cria um usuário
   * @param userDto Dados do usuário
   * @returns Usuário criado
   */
  async create(userDto: UserCreateDto) {
    userDto.password = await this.hashPassword(userDto.password);
    const user = await this.userRepository.save(userDto);

    return await this.get(user.id);
  }

  /**
   * Atualiza um usuário
   * @param userDto Dados do usuário
   * @returns Usuário atualizado
   */
  async update(userDto: UserDto): Promise<User> {
    let user = await this.userRepository.findOne(userDto.id);

    if (!user) {
      return null;
    }

    user = this.userRepository.merge(user, userDto);
    return await this.userRepository.save(user);
  }

  /**
   * Atualiza a senha de um usuário
   * @param userUpdatePasswordDto Dados da nova senha do usuário
   * @returns Usuário
   */
  async updatePassword(userUpdatePasswordDto: UserUpdatePasswordDto) {
    let user = await this.userRepository.findOne(userUpdatePasswordDto.id);

    if (!user) {
      return null;
    }

    user.password = await this.hashPassword(userUpdatePasswordDto.password);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  /**
   * Marca um usuário como deletado
   * @param user Usuário
   */
  async disable(user: User): Promise<void> {
    if (!user) {
      return null;
    }

    await this.userRepository.softRemove(user);
  }

  /**
   * Verifica se um usuário existe pelo email
   * @param email Email do usuário
   * @returns Verdadeiro, se o usuário existe, caso contrário, falso
   */
  async userExistsByEmail(email: string): Promise<boolean> {
    return (
      (await this.userRepository.findOne({
        where: { email: email },
        withDeleted: true,
      })) !== undefined
    );
  }

  /**
   * Gera um hash HMAC SHA512 com salt aleatório
   * @param password Senha em texto plano
   * @returns Hash gerado
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64');
    const hash = createHmac('sha512', salt)
      .update(password)
      .digest('base64');
    return `${salt}$${hash}`;
  }

  /**
   * Verifica se o hash gerado sobre a senha informada é igual
   * ao hash da senha do usuário
   * @param user Usuário
   * @param plainPassword Senha em texto plano
   * @returns Verdadeiro, se os hashes são iguais, caso contrário, falso
   */
  public async isPasswordValid(
    user: User,
    plainPassword: string,
  ): Promise<boolean> {
    user = await this.userRepository.findOne(user.id, { select: ['password'] });
    const [salt, password] = user.password.split('$');

    const hash = createHmac('sha512', salt)
      .update(plainPassword)
      .digest('base64');

    return password === hash;
  }
}
