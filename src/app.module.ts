import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './users/users.module';
import { PrticipanteModule } from './participantes/participantes.module';
import { FilterModule } from './filters/filters.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [CardsModule, ProductsModule, UserModule, PrticipanteModule, FilterModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
