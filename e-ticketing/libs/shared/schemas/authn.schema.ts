import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class AuthN {
  @Prop({ required: true, unique: true, immutable: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export type AuthNDocument = HydratedDocument<AuthN>;

export const AuthNSchema = SchemaFactory.createForClass(AuthN);
