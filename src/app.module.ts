import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [CardsModule, ProductsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
