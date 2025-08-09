import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ default: uuidv4 })
    _id: string;

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Boolean, default: false })
    isActive: boolean;

    @Prop({ 
        type: String, 
        enum: ['en', 'ar', 'fr'], 
        default: 'en' 
    })
    language: string;

    @Prop({ type: String, default: 'uploads/profile_default.jpg' })
    avatar: string;

    @Prop({ type: String, default: 'uploads/cover_default.png' })
    background: string;

    @Prop()
    hashedRefreshToken: string;

    @Prop()
    resetPasswordToken?: string;
  
    @Prop()
    resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
