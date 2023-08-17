// email.service.ts
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class EmailService {

  private emailTransporter: Transporter;

  constructor() {
    this.emailTransporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'wilianjuniordemellolopes@gmail.com', // Insira o seu e-mail do Gmail
        pass: 'Milt091547@', // Insira a senha do seu e-mail
      },
    });
  }

  async sendEmailsForDueTasks() {
    // try {

    //   const currentDate = new Date();

    //   const emailOptions = {
    //     from: 'wilianjuniordemellolopes@gmail.com',
    //     to: 'recipient-email@example.com', // Insira o e-mail do destinatário
    //     subject: 'Assunto do E-mail',
    //     text: 'Conteúdo do E-mail',
    //   };

    //   await this.emailTransporter.sendMail(emailOptions);

    //   console.log('E-mail enviado com sucesso.');

    // } catch (error) {
    //   console.error('Erro ao enviar e-mail:', error);
    // }
  }
}
