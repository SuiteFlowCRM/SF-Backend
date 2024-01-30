import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) { }

  // @Put(':id/atividade')
  // async updateAtividadeUser(
  //   @Param('id') userId: number,
  //   @Body() updatedAtividadeUserData: any,
  // ): Promise<any> {
  //   return this.userService.incrementAtividade(userId, updatedAtividadeUserData.atividade);
  // }

  @Put(':id/atividade')
  async updateAtividadeUser(
    @Param('id') userId: number,
    @Body() updatedAtividadeUserData: any,
  ): Promise<any> {
    //console.log('Valor recebido no servidor:', updatedAtividadeUserData.atividade); // Adicione esta linha
    return this.userService.incrementAtividade(userId, updatedAtividadeUserData.atividade);
  }




  @Put(':id')
  async updateUser(
    @Param('id') userId: number,
    @Body() updatedUserData: any,
  ): Promise<any> {
    return this.userService.updateUser(userId, updatedUserData);
  }


  @Post()
  async createUser(@Body() userData: any): Promise<any> {
    return this.userService.createUser(userData);
  }

  @Get('getCurrentUser')
  async findAllFilteredUsers(
    @Query('login') login: string,
  ): Promise<any[]> {

    return this.userService.findAllFilteredUsers(login);
  }

  @Get('getUsers')
  async findAllFiltered(
    @Query('empresa') empresa: string,
  ): Promise<any[]> {

    return this.userService.findAllFiltered(empresa);
  }

  // @Delete(':id')
  // async deleteProduct(@Param('id') productId: number): Promise<void> {
  //   await this.productsService.deleteProduct(productId);
  // }

}
