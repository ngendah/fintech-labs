import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { LogInUserDto } from 'src/user/dto/logInUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User | undefined> {
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data });
  }

  async signIn(data: LogInUserDto): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      return;
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (isMatch) {
      return user;
    }
  }
}
