import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MicroServiceException, RpcExceptionCode } from '../rpc-exception';
import { TokenDto } from '../dtos/token.dto';
import {
  CacheByEmail,
  CacheById,
  UserCacheService,
} from '../modules/user-cache/user-cache.service';

@Injectable()
export class AuthnzRepository {
  private logger = new Logger(AuthnzRepository.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private userCacheService: UserCacheService,
  ) {}

  async userById(id: string): Promise<UserDocument> {
    const cache = this.userCacheService.cacheBy(CacheById);
    let user: UserDocument | null | undefined = await cache.get(id);
    if (!user) {
      this.logger.debug(`id cache miss ${id}`);
      user = await this.userModel.findById(id);
      if (!user) {
        throw new Error(`User not found`);
      }
      cache.set(user);
    }
    return user;
  }

  async userByEmail(email: string): Promise<UserDocument> {
    const cache = this.userCacheService.cacheBy(CacheByEmail);
    let user: UserDocument | null | undefined = await cache.get(email);
    if (!user) {
      this.logger.debug(`email cache miss ${email}`);
      user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new MicroServiceException(
          `User not found`,
          RpcExceptionCode.INVALID_CREDENTIALS,
        );
      }
      cache.set(user);
    }
    return user;
  }

  async authn(email: string, password: string): Promise<TokenDto> {
    const user = await this.userByEmail(email);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new MicroServiceException(
        `Incorrect password`,
        RpcExceptionCode.INVALID_CREDENTIALS,
      );
    }
    const payload = { sub: user._id };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async verifyToken(token: string): Promise<UserDocument> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload['sub']) {
        throw new Error(`Token does not have subject field`);
      }
      return this.userById(payload['sub']);
    } catch (error) {
      this.logger.error(error);
      throw new MicroServiceException(
        `Invalid token`,
        RpcExceptionCode.INVALID_CREDENTIALS,
      );
    }
  }
}
