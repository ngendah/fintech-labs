import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Registration {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export type RegistrationDocument = HydratedDocument<Registration>;

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
