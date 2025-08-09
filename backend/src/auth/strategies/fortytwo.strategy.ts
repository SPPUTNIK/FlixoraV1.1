import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
const FortyTwoStrategy42 = require('passport-42').Strategy;
import { oauthConstants } from '../constants';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(FortyTwoStrategy42, '42') {
  constructor() {
    const config = {
      clientID: oauthConstants.fortytwo.clientId!,
      clientSecret: oauthConstants.fortytwo.clientSecret!,
      callbackURL: oauthConstants.fortytwo.redirectUri!, // Use the constant instead of env directly
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      scope: 'public',
      passReqToCallback: false,
    };
    
    console.log('42 OAuth Strategy Config:', {
      clientID: config.clientID,
      clientSecret: config.clientSecret ? '[HIDDEN]' : undefined,
      callbackURL: config.callbackURL,
      authorizationURL: config.authorizationURL,
      tokenURL: config.tokenURL,
      scope: config.scope
    });
    
    super(config);
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('42 OAuth validate called with:');
    console.log('- Access Token:', accessToken ? '[PRESENT]' : '[MISSING]');
    console.log('- Profile:', JSON.stringify(profile, null, 2));
    
        const userData = profile._json || profile;
    
    console.log('Profile _json:', JSON.stringify(userData, null, 2));
    
    const user = {
      provider: '42',
      providerId: userData.id?.toString() || profile.id?.toString(),
      username: userData.login || profile.username,
      email: userData.email || profile.emails?.[0]?.value,
      first_name: userData.first_name || userData.usual_first_name,
      last_name: userData.last_name || userData.usual_last_name,
      // 42 API returns image in different formats
      avatar: userData.image?.link || 
              userData.image?.versions?.large || 
              userData.image?.versions?.medium || 
              userData.image?.versions?.small ||
              profile.photos?.[0]?.value ||
              null,
      accessToken,
    };
    
    console.log('=== Processed 42 User Data ===');
    console.log('Final user object:', user);
    
    return user;
  }
}
