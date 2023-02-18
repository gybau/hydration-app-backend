import { Body, Controller, Post, Get } from '@nestjs/common';
import { User, UserJWTPayload } from '../decorators/user.decorator';
import { AuthSigninDto, AuthSignupDto, AuthUpdateDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() { name, email, password }: AuthSignupDto) {
    return this.authService.signup(name, email, password);
  }

  @Post('/signin')
  signin(@Body() { email, password }: AuthSigninDto) {
    return this.authService.signin(email, password);
  }

  @Post('/update')
  updateUser(@Body() body: AuthUpdateDto, @User() user: UserJWTPayload) {
    return this.authService.updateUser(user.id, body);
  }

  @Get('/me')
  getMe(@User() user: UserJWTPayload) {
    return this.authService.getMe(user.id);
  }
}
