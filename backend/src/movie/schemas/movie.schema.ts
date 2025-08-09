// src/movie/schemas/movie.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;


@Schema({
  versionKey: false, // disables __v entirely
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class Movie {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ unique: true, sparse: true })
  imdbId?: string;
}


export const MovieSchema = SchemaFactory.createForClass(Movie);
