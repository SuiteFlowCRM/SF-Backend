import { Controller, Post, Body, Get, Put, Param, Query, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('produtos')
export class ProductsController {
  
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async createProduct(@Body() newProduct: any): Promise<any> {
    return this.productsService.createProduct(newProduct);
  }

  @Get('getProducts')
  async findAllFiltered(
    @Query('empresa') empresa: string,
  ): Promise<any[]> {

    return this.productsService.findAllFiltered(empresa);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') productId: number,
    @Body() updatedProductData: any,
  ): Promise<any> {
    return this.productsService.updateProduct(productId, updatedProductData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: number): Promise<void> {
    await this.productsService.deleteProduct(productId);
  }

}
