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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async get(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async create(userDto: UserCreateDto) {
    userDto.password = await this.hashPassword(userDto.password);
    const user = await this.userRepository.save(userDto);

    return await this.get(user.id);
  }

  async update(userDto: UserDto): Promise<User> {
    let user = await this.userRepository.findOne(userDto.id);

    if (!user) {
      return null;
    }

    user = this.userRepository.merge(user, userDto);
    return await this.userRepository.save(user);
  }

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

  async disable(user: User): Promise<void> {
    if (!user) {
      return null;
    }

    this.userRepository.softRemove(user);
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    return (
      (await this.userRepository.findOne({
        where: { email: email },
        withDeleted: true,
      })) !== undefined
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64');
    const hash = createHmac('sha512', salt)
      .update(password)
      .digest('base64');
    return `${salt}$${hash}`;
  }

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
