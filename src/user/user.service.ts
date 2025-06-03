import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { User } from 'src/common/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(user: User) {
    try {
      return await this.prisma.user.create({ data: user });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        if (err.code === 'P2002')
          throw new ConflictException('User with given email already exists');
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
