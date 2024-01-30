import { Controller, Post, Body } from '@nestjs/common';
import { MensagensService } from './mensagens.service';

@Controller('mensagens')
export class MensagensController {
  constructor(private readonly mensagensService: MensagensService) {}

  @Post('/enviar')
  async enviarMensagem(@Body() body: { numero: string; contato: string; mensagem: string }): Promise<string> {
    const { numero, contato, mensagem } = body;
    await this.mensagensService.enviarMensagemParaBotConversa(numero, contato, mensagem);
    return 'Mensagem enviada com sucesso!';
  }
}
