import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MensagensService {
  async enviarMensagemParaBotConversa(numero: string, contato: string, mensagem: string): Promise<void> {
    const urlWebhook = 'https://backend.botconversa.com.br/api/v1/webhooks-automation/catch/31401/RZPmGB3NnLLL/';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return new Promise<void>((resolve, reject) => {
      const req = axios.post(urlWebhook, { numero, contato, mensagem }, options);

      req.then(() => {
        resolve();
      }).catch(error => {
        console.error('Erro ao enviar mensagem para o BotConversa:', error.message);
        reject(new Error('Falha ao enviar mensagem para o BotConversa.'));
      });
    });
  }
}
