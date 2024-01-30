import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class CardsService {

  private dbConfig = databaseConfig;


  // Método para buscar os cards vendidos no último minuto
  async findSoldLastMinute(): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();

      // Calcular o timestamp atual menos 60 segundos (1 minuto)
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

      const query = `
          SELECT *
          FROM cards
          WHERE status = 'Vendido' AND modification_date >= $1;
        `;

      const values = [oneMinuteAgo];

      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to fetch sold cards from the last minute');
    } finally {
      await client.end();
    }
  }


  async findAllFiltered(tipoParticipante: string, idUser: string, empresa: string, listaAfilhados: { name: string, id: string }[], startDate: string): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      console.log(startDate)
      const formattedStartDate = new Date(startDate).toISOString();
      console.log(formattedStartDate)

      if (tipoParticipante === 'Administrador' && startDate) {

        //console.log('Todos os usuários')
        query = `
          SELECT * FROM cards 
          WHERE empresa = '${empresa}' COLLATE "C"
          AND modification_date >= '${formattedStartDate}'
        `;
      }

      if (tipoParticipante === 'Escritorio') {
        //console.log('Todos os usuários')
        query = `
          SELECT * FROM cards 
          WHERE empresa = '${empresa}' COLLATE "C"
          AND modification_date >= '${formattedStartDate}'
        `;
      }

      if (tipoParticipante === 'Producao') {
        //console.log('Todos os usuários')
        query = `
          SELECT * FROM cards 
          WHERE empresa = '${empresa}' COLLATE "C"
          AND modification_date >= '${formattedStartDate}'
        `;
      }

      if (tipoParticipante === 'Externo') {
        //console.log('Externo');
        //console.log('idUser', idUser);

        query = `
        SELECT *
        FROM cards
        WHERE empresa = '${empresa}' COLLATE "C"
        AND EXISTS (
            SELECT 1
            FROM jsonb_array_elements(to_jsonb(lista_compartilhar)) AS item
            WHERE item->>'id' = '${idUser}'
        )

        `;
        // A consulta utiliza $1 e $2 para os parâmetros. 
        // Certifique-se de que a empresa e o idUser sejam passados na mesma ordem.
      }

      if (listaAfilhados && listaAfilhados.length > 0 && tipoParticipante === 'Parceiro') {
        //console.log('criado por afilhados')

        //const afilhadosIds = listaAfilhados.map(afilhado => `'${afilhado.id}'`).join(', ');
        const afilhadosIds = listaAfilhados.map(afilhado => Number(afilhado.id));

        query = `
          SELECT * FROM cards 
          WHERE empresa = '${empresa}' COLLATE "C" 
          AND (id_create_by = '${idUser}' COLLATE "C" OR id_create_by = ANY(ARRAY[${afilhadosIds}]))
          AND modification_date >= '${formattedStartDate}'
        `;
      }

      if ((!listaAfilhados || listaAfilhados.length <= 0) && (tipoParticipante === 'Parceiro' || tipoParticipante === 'free')) {
        //console.log('apenas criado pelo usuário')
        query = `
          SELECT * FROM cards 
          WHERE empresa = '${empresa}' COLLATE "C" 
          AND id_create_by = '${idUser}' COLLATE "C"
          AND modification_date >= '${formattedStartDate}'
        `;
      }

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao executar a consulta SQL:', error);
      throw new Error('Falha ao buscar os cards no banco');
    } finally {
      await client.end();
    }
  }


  async deleteCard(cardId: number): Promise<void> {
    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        DELETE FROM cards
        WHERE id = $1;
      `;

      const values = [cardId];

      await client.query(query, values);
    } catch (error) {
      throw new Error('Failed to delete card');
    } finally {
      await client.end();
    }
  }

  async arquivateCard(cardId: number, updatedCardData: any): Promise<any> {
    const {
      id_column,
      nivel,
      status,
      lista_historico
    } = updatedCardData;

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE cards
        SET
          id_column = $1,
          nivel = $2,
          status = $3,
          lista_historico = $4
        WHERE
          id = $5
        RETURNING *;
      `;

      const values = [
        id_column,
        nivel,
        status,
        lista_historico,
        cardId,
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Card not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to update card');
    } finally {
      await client.end();
    }
  }

  async updateCard(cardId: number, updatedCardData: any): Promise<any> {
    const {
      document_card,
      name,
      name_obra,
      valor,
      valor_venda,
      email,
      fone,
      city,
      estado,
      previsao,
      meio_contato,
      id_column,
      nivel,
      etiqueta,
      motivo_perca,
      modification_date,
      produto,
      status,
      lista_tarefas,
      lista_historico,
      id_create_by,
      create_by,
      name_user,
      name_obra_cliente,
      name_contato,
      lista_anexos,
      previsao_entrega,
      horas_producao,
      previsao_instalacao,
      previsao_assistencia,
      lista_compartilhar,
      cor,
      edit_date,
      prioridade,
      previsao_producao,
      recebimento_medidas,
      prazo_entrega,
      numero_pedido,
      quadros,
      metros_quadrados,
      quantidade_esquadrias,
      entrega_vidro,
      status_vidro,
      obs,
      conclusao_producao,
    } = updatedCardData;

    //console.log('TAREFAS')
    // console.log(updatedCardData.lista_tarefas)
    // console.log('HISTORICO')
    // console.log(updatedCardData.lista_historico)
    // console.log('ANEXOS')
    // console.log(updatedCardData.lista_anexos)

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE cards
        SET
          document_card = $1,
          name = $2,
          name_obra = $3,
          valor = $4,
          valor_venda = $5,
          email = $6,
          fone = $7,
          city = $8,
          estado = $9,
          previsao = $10,
          meio_contato = $11,
          id_column = $12,
          nivel = $13,
          etiqueta = $14,
          motivo_perca = $15,
          modification_date = $16,
          produto = $17,
          status = $18,
          lista_tarefas = $19,
          lista_historico = $20,
          id_create_by = $21,
          create_by = $22,
          name_user = $23,
          name_obra_cliente = $24,
          name_contato = $25,
          lista_anexos = $26,
          previsao_entrega = $27,
          horas_producao = $28,
          previsao_instalacao = $29,
          previsao_assistencia = $30,
          lista_compartilhar = $31,
          cor = $32,
          edit_date = $33,
          prioridade = $34,
          previsao_producao = $35,
          recebimento_medidas = $36,
          prazo_entrega = $37,
          numero_pedido = $38,
          quadros = $39,
          metros_quadrados = $40,
          quantidade_esquadrias = $41,
          entrega_vidro = $42,
          status_vidro = $43,
          obs = $44,
          conclusao_producao = $45
        WHERE
          id = $46
        RETURNING *;
      `;

      const values = [
        document_card,
        name,
        name_obra,
        valor,
        valor_venda,
        email,
        fone,
        city,
        estado,
        previsao,
        meio_contato,
        id_column,
        nivel,
        etiqueta,
        motivo_perca,
        modification_date,
        produto,
        status,
        lista_tarefas,
        lista_historico,
        id_create_by,
        create_by,
        name_user,
        name_obra_cliente,
        name_contato,
        lista_anexos,
        previsao_entrega,
        horas_producao,
        previsao_instalacao,
        previsao_assistencia,
        lista_compartilhar,
        cor,
        edit_date,
        prioridade,
        previsao_producao,
        recebimento_medidas,
        prazo_entrega,
        numero_pedido,
        quadros,
        metros_quadrados,
        quantidade_esquadrias,
        entrega_vidro,
        status_vidro,
        obs,
        conclusao_producao,
        cardId,
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Card not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('INFORMAÇÕES SOBRE O ERRO AO ATUALIZAR O CARD:', error);
      throw new Error('Failed to update card');
    } finally {
      if (client) {
        await client.end();
      }
    }
  }

  async createCard(cardData: any): Promise<any> {
    const { document_card, name, name_obra_cliente, valor, email, fone, city, estado, previsao, meio_contato, create_by, id_create_by, name_user, id_column, date, nivel, etiqueta, empresa, motivo_perca, modification_date, produto, status, lista_tarefas, lista_historico, tipo_participante, etapa_producao, cor, edit_date, name_contato, valor_venda } = cardData;

    const client = new Client(this.dbConfig);

    try {
      await client.connect();

      // Verificar se a empresa é 'free' e o usuário já criou mais de 20 cards
      if (tipo_participante === 'free') {
        const countQuery = `
          SELECT COUNT(*) AS card_count FROM cards
          WHERE id_create_by = $1;
        `;

        const countResult = await client.query(countQuery, [id_create_by]);
        const cardCount = countResult.rows[0].card_count;

        if (cardCount >= 5) {
          throw new Error('Limite de 5 cards atingido na versão gratuita.');
        }
      }

      const query = `
        INSERT INTO cards (
          document_card,
          name,
          name_obra_cliente,
          valor,
          email,
          fone,
          city,
          estado,
          previsao,
          meio_contato,
          create_by,
          id_create_by,
          name_user,
          id_column,
          date,
          nivel,
          etiqueta,
          empresa,
          motivo_perca,
          modification_date,
          produto,
          status,
          lista_tarefas,
          lista_historico,
          etapa_producao,
          cor,
          edit_date,
          name_contato,
          valor_venda
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
        ) RETURNING *;
      `;

      const values = [
        document_card,
        name,
        name_obra_cliente,
        valor,
        email,
        fone,
        city,
        estado,
        previsao,
        meio_contato,
        create_by,
        id_create_by,
        name_user,
        id_column,
        date,
        nivel,
        etiqueta,
        empresa,
        motivo_perca,
        modification_date,
        produto,
        status,
        lista_tarefas,
        lista_historico,
        etapa_producao,
        cor,
        edit_date,
        name_contato,
        valor_venda
      ];

      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      //console.error('Informações do erro ao criar  card:', error);
      //throw new Error('Failed to create card');
    } finally {
      await client.end();
    }
  }

}
