import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthResponseDto, AuthUpdateDto } from '../dtos/auth.dto';

interface UpdateUserParams {
  name?: string;
  amount?: number;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(name: string, email: string, password: string) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return this.generateJWTToken(user.id, user.name);
  }

  async signin(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const hashedPassword = user.password;

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }

    return this.generateJWTToken(user.id, user.name);
  }

  async updateUser(id: number, data: UpdateUserParams) {
    const user = this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });

    return new AuthResponseDto(updatedUser);
  }

  async getMe(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    return new AuthResponseDto(user);
  }

  private generateJWTToken(id: number, name: string) {
    return jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: 3600 });
  }
}
