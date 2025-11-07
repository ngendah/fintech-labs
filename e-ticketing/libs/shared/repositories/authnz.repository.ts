import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MicroServiceException, RpcExceptionCode } from '../rpc-exception';

@Injectable()
export class AuthnzRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async authn(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new MicroServiceException(
        `User not found`,
        RpcExceptionCode.INVALID_CREDENTIALS,
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new MicroServiceException(
        `Incorrect password`,
        RpcExceptionCode.INVALID_CREDENTIALS,
      );
    }
    const payload = { sub: user._id };
    return this.jwtService.signAsync(payload);
  }
}
