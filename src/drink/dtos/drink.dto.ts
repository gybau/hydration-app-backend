import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DrinkResponseDto {
  constructor(partial: Partial<DrinkResponseDto>) {
    Object.assign(this, partial);
  }

  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  emoji: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Exclude()
  created_at: Date;
  @Expose({ name: 'createdAt' })
  createdAt() {
    return this.created_at;
  }

  @Exclude()
  user_id: number;
}

export class AddDrinkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  emoji: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
