import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class CardsService {

  private dbConfig = databaseConfig;

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
    } = updatedCardData;

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE cards
        SET
          id_column = $1,
          nivel = $2,
          status = $3
        WHERE
          id = $4
        RETURNING *;
      `;

      const values = [
        id_column,
        nivel,
        status,
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
    } = updatedCardData;

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
          email = $5,
          fone = $6,
          city = $7,
          estado = $8,
          previsao = $9,
          meio_contato = $10,
          id_column = $11,
          nivel = $12,
          etiqueta = $13,
          motivo_perca = $14,
          modification_date = $15,
          produto = $16,
          status = $17,
          lista_tarefas = $18,
          lista_historico = $19
        WHERE
          id = $20
        RETURNING *;
      `;

      const values = [
        document_card,
        name,
        name_obra,
        valor,
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

  async findAllFiltered(tipoParticipante: string, idUser: string, empresa: string, listaAfilhados: { name: string, id: string }[]): Promise<any[]> {
    const client = new Client(this.dbConfig);

    console.log(tipoParticipante)
    console.log(idUser)
    console.log(empresa)
    console.log(listaAfilhados)
    try {
      await client.connect();
      let query = '';
  
      if (tipoParticipante === 'Administrador') {
        console.log('Todos os usuarios')
        query = `
          SELECT * FROM cards 
          WHERE empresa = '${empresa}' COLLATE "C"
        `;
      } else {
        if (listaAfilhados && listaAfilhados.length > 0) {
          console.log('criado por afilhados')
          const afilhadosIds = listaAfilhados.map(afilhado => `'${afilhado.id}'`).join(', ');
          query = `
            SELECT * FROM cards 
            WHERE empresa = '${empresa}' COLLATE "C" AND (id_create_by = '${idUser}' COLLATE "C" OR id_create_by = ANY(ARRAY[${afilhadosIds}]))
          `;
        } else {
          console.log('apenas creado pelo usuario')
          query = `
            SELECT * FROM cards 
            WHERE empresa = '${empresa}' COLLATE "C" AND id_create_by = '${idUser}' COLLATE "C"
          `;
        }
      }
  
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar os cards no banco');
    } finally {
      await client.end();
    }
  }
  


  // async findAllFiltered(tipoParticipante: string, idUser: string, listaAfilhados: { name: string, id: string }[]): Promise<any[]> {
  //   const client = new Client(this.dbConfig);
  //   try {
  //     await client.connect();
  //     let query = '';

  //     if (tipoParticipante === 'Administrador') {
  //       query = 'SELECT * FROM cards';
  //     } else {
  //       if (listaAfilhados && listaAfilhados.length > 0) {
  //         const afilhadosIds = listaAfilhados.map(afilhado => `'${afilhado.id}'`).join(', ');
  //         query = `
  //         SELECT * FROM cards 
  //         WHERE id_create_by = '${idUser}' COLLATE "C" OR id_create_by = ANY(ARRAY[${afilhadosIds}])
  //       `;
  //       } else {
  //         query = `
  //         SELECT * FROM cards 
  //         WHERE id_create_by = '${idUser}' COLLATE "C"
  //       `;
  //       }
  //     }

  //     const result = await client.query(query);
  //     return result.rows;
  //   } catch (error) {
  //     throw new Error('Failed to fetch cards');
  //   } finally {
  //     await client.end();
  //   }
  // }

  async createCard(cardData: any): Promise<any> {
    const { document_card, name, name_obra, valor, email, fone, city, estado, previsao, meio_contato, create_by, id_create_by, name_user, id_column, date, nivel, etiqueta, empresa, motivo_perca, modification_date, produto, status, lista_tarefas, lista_historico } = cardData;

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        INSERT INTO cards (
          document_card,
          name,
          name_obra,
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
          lista_historico
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
        ) RETURNING *;
      `;

      const values = [
        document_card,
        name,
        name_obra,
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
        lista_historico
      ];

      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Informações do erro ao criar  card:', error);
      throw new Error('Failedto create card');
    } finally {
      await client.end();
    }
  }
}
