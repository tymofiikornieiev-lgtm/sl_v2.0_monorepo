import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import CreateUserDto from './dto/create-user.dto';
import { HashingProvider } from '../auth/provider/hashing.provider';
import { UserRole } from './interfaces/user-role.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async getAllUsers() {
    return await this.userRepository.find({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      order: { id: 'ASC' },
    });
  }

  async createUser(userDto: CreateUserDto) {
    if (userDto.password !== userDto.passwordConfirmation) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      userDto.password,
    );

    const { passwordConfirmation, ...rest } = userDto;
    const newUser = this.userRepository.create({
      ...rest,
      passwordHash: hashedPassword,
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to create user. Please try again later.',
      );
    }
  }

  async findUserByEmail(email: string) {
    let user: User | null = null;

    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'User with given username could not be found',
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async findUserById(userId: number) {
    let user: User | null = null;

    try {
      user = await this.userRepository.findOne({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Unable to load user by id',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  public async updateUserRole(userId: number, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.role = role;

    await this.userRepository.save(user);

    return await this.findUserById(userId);
  }
}
