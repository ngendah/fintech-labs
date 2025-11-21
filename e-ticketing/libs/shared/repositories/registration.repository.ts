import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { ClientSession, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  CacheByEmail,
  CacheById,
  UserCacheService,
} from '../modules/user-cache/user-cache.service';

@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectModel(User.name) private registrationModel: Model<User>,
    private userCacheService: UserCacheService,
  ) {}

  async new(user: User, session?: ClientSession): Promise<UserDocument> {
    const password = await bcrypt.hash(user.password, 10);
    const reg = new this.registrationModel({ ...user, password });
    const newUser = await reg.save({ session });
    this.userCacheService.cacheBy(CacheByEmail).set(newUser);
    this.userCacheService.cacheBy(CacheById).set(newUser);
    return newUser;
  }

  get(email: string): Promise<UserDocument | null> {
    return this.registrationModel.findOne({ email }).exec();
  }
}
