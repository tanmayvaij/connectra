import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/common/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: User) {
    const password = await hash(user.password, await genSalt(12));

    const createdUser = await this.userService.createUser({
      email: user.email,
      password,
    });

    return this.generateToken(createdUser.email);
  }

  async login(user: User) {
    const userFromDB = await this.userService.findUser(user.email);

    if (await compare(user.password, userFromDB.email))
      return this.generateToken(user.email);

    throw new UnauthorizedException('Invalid credentials');
  }

  private generateToken(email: string) {
    return { email, token: this.jwtService.sign({ email }) };
  }
}
