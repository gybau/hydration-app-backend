import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
