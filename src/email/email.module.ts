// email-notification.module.ts
import { Module } from '@nestjs/common';
import * as cron from 'node-cron';
import { EmailService } from './email.service'; // Importe o serviço de envio de e-mails

@Module({
  providers: [EmailService],
})
export class EmailModule {
  constructor(private readonly emailService: EmailService) {
    // Agendar a tarefa para executar a cada minuto
    cron.schedule('* * * * *', () => {
      this.emailService.sendEmailsForDueTasks();
      //console.log('Scheduled email task executed.');
    });
  }
}



