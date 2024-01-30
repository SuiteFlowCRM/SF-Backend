import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class OrcamentosService {

  private dbConfig = databaseConfig;



    async deleteOrcamento(orcamentoId: number): Promise<void> {
    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        DELETE FROM orcamentos
        WHERE id = $1;
      `;

      const values = [orcamentoId];

      await client.query(query, values);
    } catch (error) {
      throw new Error('Failed to delete orçamento');
    } finally {
      await client.end();
    }
  }



  async updateOrcamento(cardId: number, updatedCardData: any): Promise<any> {
    const {
      name,
      email,
      fone,
      city,
      estado,
      desconto,
      status,
      lista_produtos,
      valor_total,
      observacoes,
      obra,
      pagamento,
      frete,
      icms,
      valor_frete,
      date_recalculo,
    } = updatedCardData;


    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE orcamentos
        SET
          name = $1,
          email = $2,
          fone = $3,
          city = $4,
          estado = $5,
          desconto = $6,
          status = $7,
          lista_produtos = $8,
          valor_total = $9,
          observacoes = $10,
          obra = $11,
          pagamento = $12,
          frete = $13,
          icms = $14,
          valor_frete = $15,
          date_recalculo = $16
        WHERE
          id = $17
        RETURNING *;
      `;

      const values = [
        name,
        email,
        fone,
        city,
        estado,
        desconto,
        status,
        lista_produtos,
        valor_total,
        observacoes,
        obra,
        pagamento,
        frete,
        icms,
        valor_frete,
        date_recalculo,
        cardId,
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Card not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('INFORMAÇÕES SOBRE O ERRO AO ATUALIZAR O ORÇAMENTO:', error);
      throw new Error('Failed to update card');
    } finally {
      if (client) {
        await client.end();
      }
    }
  }


  async getLastOrcamentoNumber(): Promise<number> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();

      // Consulta SQL para buscar o último número de orçamento
      const query = 'SELECT MAX(document) as lastNumber FROM orcamentos';

      const result = await client.query(query);

      if (result.rows.length > 0) {
        // Verifique se há resultados e obtenha o último número
        const lastNumber = result.rows[0].lastnumber || 0;
        return lastNumber;
      }

      // Caso não haja resultados, retorne 0
      return 0;
    } catch (error) {
      throw new Error('Failed to fetch the last orçamento number');
    } finally {
      await client.end();
    }
  }


  async createOrcamento(orcamentoData: any): Promise<any> {
    const { empresa, document, name, email, fone, city, estado, id_create_by, date_create, status } = orcamentoData;

    const client = new Client(this.dbConfig);

    try {
      await client.connect();

      const query = `
        INSERT INTO orcamentos (
          empresa,
          document,
          name,
          email,
          fone,
          city,
          estado,
          id_create_by,
          date_create,
          status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *;
      `;

      const values = [
        empresa,
        document,
        name,
        email,
        fone,
        city,
        estado,
        id_create_by,
        date_create,
        status
      ];

      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {

    } finally {
      await client.end();
    }
  }

  async findOrcamento(tipoParticipante: string, idUser: string, empresa: string): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      if (tipoParticipante === 'Administrador') {
        //console.log('Todos os usuários')
        query = `
          SELECT * FROM orcamentos 
          WHERE empresa = '${empresa}' 
            AND (status = 'Solicitado' OR status = 'Aceito' OR id_create_by = '${idUser}')
        `;
      }


      if (tipoParticipante === 'Parceiro') {

        //console.log('Todos os usuários')
        query = `
        SELECT * FROM orcamentos 
        WHERE id_create_by = '${idUser}' COLLATE "C"
          `;
      }

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar orçamentos no banco');
    } finally {
      await client.end();
    }
  }


  // // Método para buscar os cards vendidos no último minuto
  // async findSoldLastMinute(): Promise<any[]> {
  //   const client = new Client(this.dbConfig);

  //   try {
  //     await client.connect();

  //     // Calcular o timestamp atual menos 60 segundos (1 minuto)
  //     const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

  //     const query = `
  //         SELECT *
  //         FROM cards
  //         WHERE status = 'Vendido' AND modification_date >= $1;
  //       `;

  //     const values = [oneMinuteAgo];

  //     const result = await client.query(query, values);
  //     return result.rows;
  //   } catch (error) {
  //     throw new Error('Failed to fetch sold cards from the last minute');
  //   } finally {
  //     await client.end();
  //   }
  // }


  // async findAllFiltered(tipoParticipante: string, idUser: string, empresa: string, listaAfilhados: { name: string, id: string }[], startDate: string): Promise<any[]> {
  //   const client = new Client(this.dbConfig);

  //   try {
  //     await client.connect();
  //     let query = '';

  //     console.log(startDate)
  //     const formattedStartDate = new Date(startDate).toISOString();
  //     console.log(formattedStartDate)

  //     if (tipoParticipante === 'Administrador' && startDate) {

  //       //console.log('Todos os usuários')
  //       query = `
  //         SELECT * FROM cards 
  //         WHERE empresa = '${empresa}' COLLATE "C"
  //         AND modification_date >= '${formattedStartDate}'
  //       `;
  //     }

  //     if (tipoParticipante === 'Escritorio') {
  //       //console.log('Todos os usuários')
  //       query = `
  //         SELECT * FROM cards 
  //         WHERE empresa = '${empresa}' COLLATE "C"
  //         AND modification_date >= '${formattedStartDate}'
  //       `;
  //     }

  //     if (tipoParticipante === 'Producao') {
  //       //console.log('Todos os usuários')
  //       query = `
  //         SELECT * FROM cards 
  //         WHERE empresa = '${empresa}' COLLATE "C"
  //         AND modification_date >= '${formattedStartDate}'
  //       `;
  //     }

  //     if (tipoParticipante === 'Externo') {
  //       //console.log('Externo');
  //       //console.log('idUser', idUser);

  //       query = `
  //       SELECT *
  //       FROM cards
  //       WHERE empresa = '${empresa}' COLLATE "C"
  //       AND EXISTS (
  //           SELECT 1
  //           FROM jsonb_array_elements(to_jsonb(lista_compartilhar)) AS item
  //           WHERE item->>'id' = '${idUser}'
  //       )

  //       `;
  //       // A consulta utiliza $1 e $2 para os parâmetros. 
  //       // Certifique-se de que a empresa e o idUser sejam passados na mesma ordem.
  //     }

  //     if (listaAfilhados && listaAfilhados.length > 0 && tipoParticipante === 'Parceiro') {
  //       //console.log('criado por afilhados')

  //       //const afilhadosIds = listaAfilhados.map(afilhado => `'${afilhado.id}'`).join(', ');
  //       const afilhadosIds = listaAfilhados.map(afilhado => Number(afilhado.id));

  //       query = `
  //         SELECT * FROM cards 
  //         WHERE empresa = '${empresa}' COLLATE "C" 
  //         AND (id_create_by = '${idUser}' COLLATE "C" OR id_create_by = ANY(ARRAY[${afilhadosIds}]))
  //         AND modification_date >= '${formattedStartDate}'
  //       `;
  //     }

  //     if ((!listaAfilhados || listaAfilhados.length <= 0) && (tipoParticipante === 'Parceiro' || tipoParticipante === 'free')) {
  //       //console.log('apenas criado pelo usuário')
  //       query = `
  //         SELECT * FROM cards 
  //         WHERE empresa = '${empresa}' COLLATE "C" 
  //         AND id_create_by = '${idUser}' COLLATE "C"
  //         AND modification_date >= '${formattedStartDate}'
  //       `;
  //     }

  //     const result = await client.query(query);
  //     return result.rows;
  //   } catch (error) {
  //     console.error('Erro ao executar a consulta SQL:', error);
  //     throw new Error('Falha ao buscar os cards no banco');
  //   } finally {
  //     await client.end();
  //   }
  // }


  // async deleteCard(cardId: number): Promise<void> {
  //   const client = new Client(this.dbConfig);
  //   try {
  //     await client.connect();

  //     const query = `
  //       DELETE FROM cards
  //       WHERE id = $1;
  //     `;

  //     const values = [cardId];

  //     await client.query(query, values);
  //   } catch (error) {
  //     throw new Error('Failed to delete card');
  //   } finally {
  //     await client.end();
  //   }
  // }

  // async arquivateCard(cardId: number, updatedCardData: any): Promise<any> {
  //   const {
  //     id_column,
  //     nivel,
  //     status,
  //     lista_historico
  //   } = updatedCardData;

  //   const client = new Client(this.dbConfig);
  //   try {
  //     await client.connect();

  //     const query = `
  //       UPDATE cards
  //       SET
  //         id_column = $1,
  //         nivel = $2,
  //         status = $3,
  //         lista_historico = $4
  //       WHERE
  //         id = $5
  //       RETURNING *;
  //     `;

  //     const values = [
  //       id_column,
  //       nivel,
  //       status,
  //       lista_historico,
  //       cardId,
  //     ];

  //     const result = await client.query(query, values);

  //     if (result.rows.length === 0) {
  //       throw new Error('Card not found');
  //     }

  //     return result.rows[0];
  //   } catch (error) {
  //     throw new Error('Failed to update card');
  //   } finally {
  //     await client.end();
  //   }
  // }





}
