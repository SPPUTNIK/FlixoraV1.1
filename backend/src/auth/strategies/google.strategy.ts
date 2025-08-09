import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { oauthConstants } from '../constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: oauthConstants.google.clientId!,
      clientSecret: oauthConstants.google.clientSecret!,
      callbackURL: oauthConstants.google.redirectUri!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    const user = {
      provider: 'google',
      providerId: id,
      username: emails?.[0]?.value?.split('@')[0] || `google_${id}`,
      email: emails?.[0]?.value,
      first_name: name?.givenName || '',
      last_name: name?.familyName || '',
      avatar: photos?.[0]?.value || null,
      accessToken,
    };

    done(null, user);
  }
}
