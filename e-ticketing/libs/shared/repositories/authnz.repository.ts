import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class AuthnzRepository {
  constructor(
    @InjectModel(User.name) private registrationModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async authn(email: string, password: string): Promise<string> {
    const user = await this.registrationModel.findOne({ email }).exec();
    if (!user) {
      throw new Error(`User not found`);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error(`Incorrect password`);
    }
    const payload = { sub: user._id };
    return this.jwtService.signAsync(payload);
  }
}
