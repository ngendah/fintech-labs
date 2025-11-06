import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class RegistrationRepository {
  constructor(@InjectModel(User.name) private registrationModel: Model<User>) {}

  async new(user: User): Promise<UserDocument> {
    user.password = await bcrypt.hash(user.password, 10);
    const reg = new this.registrationModel(user);
    return reg.save();
  }

  get(email: string): Promise<UserDocument | null> {
    return this.registrationModel.findOne({ email }).exec();
  }
}
