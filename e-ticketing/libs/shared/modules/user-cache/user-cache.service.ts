import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'libs/shared/schemas/user.schema';

export interface CacheBy {
  set(document: UserDocument): Promise<UserDocument>;

  get(key: string): Promise<UserDocument | undefined>;

  prefixedKey(key: string): string;
}

export class CacheByEmail implements CacheBy {
  constructor(private readonly cacheManager: Cache) {}

  set(document: UserDocument): Promise<UserDocument> {
    return this.cacheManager.set<UserDocument>(
      this.prefixedKey(document.email),
      document,
    );
  }

  get(email: string): Promise<UserDocument | undefined> {
    return this.cacheManager.get<UserDocument>(this.prefixedKey(email));
  }

  prefixedKey(key: string): string {
    return `user-email-${key}`;
  }
}

export class CacheById implements CacheBy {
  constructor(private readonly cacheManager: Cache) {}

  set(document: UserDocument): Promise<UserDocument> {
    return this.cacheManager.set<UserDocument>(
      this.prefixedKey(document.id),
      document,
    );
  }

  get(id: string): Promise<UserDocument | undefined> {
    return this.cacheManager.get<UserDocument>(this.prefixedKey(id));
  }

  prefixedKey(key: string): string {
    return `user-id-${key}`;
  }
}

export type CacheByConstructor<T extends CacheBy> = new (
  cacheManager: Cache,
) => T;

@Injectable()
export class UserCacheService {
  private instances = new Map<Function, CacheBy>();

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  // TODO: mark as deprecated
  set(user: UserDocument) {
    return this.cacheBy(CacheByEmail).set(user);
  }

  // TODO: mark as deprecated
  get(email: string): Promise<UserDocument | undefined> {
    return this.cacheBy(CacheByEmail).get(email);
  }

  cacheBy<T extends CacheBy>(Cls: CacheByConstructor<T>): T {
    let inst = this.instances.get(Cls);
    if (!inst) {
      inst = new Cls(this.cacheManager);
      this.instances.set(Cls, inst);
    }
    return inst as T;
  }
}
