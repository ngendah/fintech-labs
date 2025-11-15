import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'libs/shared/schemas/user.schema';

const prefix = 'user-';

@Injectable()
export class UserCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  set(user: UserDocument) {
    this.cacheManager.set<UserDocument>(this.key(user.email), user);
  }

  get(email: string): Promise<UserDocument | undefined> {
    return this.cacheManager.get<UserDocument>(this.key(email));
  }

  key(email: string): string {
    return `${prefix}${email}`;
  }
}
