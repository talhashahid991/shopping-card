import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/card/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && password === user.password){ //await bcrypt.compare(password, user.password) ///passwords arent hashed
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId, userType: user.userType };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
