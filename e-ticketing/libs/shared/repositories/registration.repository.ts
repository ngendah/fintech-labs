import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { ClientSession, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationRepository {
  constructor(@InjectModel(User.name) private registrationModel: Model<User>) {}

  async new(user: User, session?: ClientSession): Promise<UserDocument> {
    const password = await bcrypt.hash(user.password, 10);
    const reg = new this.registrationModel({ ...user, password });
    return reg.save({ session });
  }

  get(email: string): Promise<UserDocument | null> {
    return this.registrationModel.findOne({ email }).exec();
  }
}
