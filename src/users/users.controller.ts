import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() usersDto: UsersDto) {
    return this.usersService.create(usersDto.name, usersDto.email);
  }
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() user: UsersDto) {
    return this.usersService.update(id, user);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
