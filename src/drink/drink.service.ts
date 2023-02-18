import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDrinkDto, DrinkResponseDto } from './dtos/drink.dto';

@Injectable()
export class DrinkService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllDrinks(): Promise<DrinkResponseDto[]> {
    const drinks = await this.prismaService.drink.findMany();

    if (!drinks.length) {
      throw new NotFoundException();
    }

    return drinks.map((drink) => new DrinkResponseDto(drink));
  }

  async getDrinksForUser(id: number): Promise<DrinkResponseDto[]> {
    const drinks = await this.prismaService.drink.findMany({
      where: {
        user_id: id,
      },
    });

    if (!drinks.length) {
      throw new NotFoundException();
    }

    return drinks.map((drink) => new DrinkResponseDto(drink));
  }

  async addDrink(userId: number, { name, emoji, amount }: AddDrinkDto) {
    const drink = await this.prismaService.drink.create({
      data: {
        name,
        emoji,
        amount,
        user_id: userId,
      },
    });
    return new DrinkResponseDto(drink);
  }

  async deleteDrink(drinkId: number) {
    await this.prismaService.drink.delete({ where: { id: drinkId } });
  }

  async getUserIdByDrinkId(drinkId: number) {
    const drink = await this.prismaService.drink.findUnique({
      where: { id: drinkId },
    });
    return drink.user_id;
  }
}
