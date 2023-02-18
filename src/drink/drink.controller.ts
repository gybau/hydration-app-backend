import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserJWTPayload } from 'src/user/decorators/user.decorator';
import { DrinkService } from './drink.service';
import { AddDrinkDto } from './dtos/drink.dto';

@Controller('drinks')
export class DrinkController {
  constructor(private readonly drinkService: DrinkService) {}
  @Get('/all')
  getAllDrinks() {
    return this.drinkService.getAllDrinks();
  }

  @Get()
  getDrinksForUser(@User() user: UserJWTPayload) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.drinkService.getDrinksForUser(user.id);
  }

  @Post('/add')
  addDrink(@Body() body: AddDrinkDto, @User() user: UserJWTPayload) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.drinkService.addDrink(user.id, body);
  }

  @Delete('/:id')
  async deleteDrink(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserJWTPayload,
  ) {
    const userId = await this.drinkService.getUserIdByDrinkId(id);

    if (userId !== user.id) {
      throw new UnauthorizedException();
    }

    return this.drinkService.deleteDrink(id);
  }
}
