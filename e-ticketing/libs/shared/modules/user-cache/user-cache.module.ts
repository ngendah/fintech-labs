import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { UserCacheService } from './user-cache.service';

@Module({
  imports: [CacheModule.register({ ttl: 1000 })],
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class UserCacheModule {}
