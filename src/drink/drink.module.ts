import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DrinkController } from './drink.controller';
import { DrinkService } from './drink.service';

@Module({
  imports: [PrismaModule],
  controllers: [DrinkController],
  providers: [
    DrinkService,
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class DrinkModule {}
