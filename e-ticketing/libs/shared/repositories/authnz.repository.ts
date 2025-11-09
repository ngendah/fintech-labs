import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MicroServiceException, RpcExceptionCode } from '../rpc-exception';

@Injectable()
export class AuthnzRepository {
  private logger = new Logger(AuthnzRepository.name);
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

  async verifyToken(token: string): Promise<UserDocument> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload['sub']) {
        throw new Error(`Token does not have subject field`);
      }
      const user = await this.userModel.findById(payload['sub']);
      if (!user) {
        throw new Error(`User not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new MicroServiceException(
        `Invalid token`,
        RpcExceptionCode.INVALID_CREDENTIALS,
      );
    }
  }
}
