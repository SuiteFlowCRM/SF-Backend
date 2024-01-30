import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class ProcessoService {

  private dbConfig = databaseConfig;

    async  createProcesso(newProcesso: any): Promise<any> {
    const { empresa, title, setor, ordem } = newProcesso;
  
    const client = new Client(this.dbConfig);
  
    try {
      await client.connect();
  
  
      const query = `
        INSERT INTO processos (
          empresa,
          title,
          setor,
          ordem
        ) VALUES (
          $1, $2, $3, $4
        ) RETURNING *;
      `;
  
      const values = [
        empresa,
        title,
        setor,
        ordem
      ];
  
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error('Informações do erro ao criar processo:', error);
      //throw new Error('Failed to create card');
    } finally {
      await client.end();
    }
  }


  async findAllFiltered( empresa: string ): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      query = `
        SELECT * FROM processos 
        WHERE empresa = '${empresa}' COLLATE "C"
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar os processos no banco');
    } finally {
      await client.end();
    }
  }

  async updateProcesso(processoId: number, updatedProcessoData: any): Promise<any> {
    const {
      title,
      setor,
      ordem,
    } = updatedProcessoData;

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE processos
        SET
          title = $1,
          setor = $2,
          ordem = $3
        WHERE
          id = $4
        RETURNING *;
      `;

      const values = [
        title,
        setor,
        ordem,
        processoId,
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Card not found');
      }

      return result.rows[0];

    } catch (error) {
      throw new Error('Falha ao atualizar processo');
    } finally {
      await client.end();
    }
  }

  async deleteProcesso(processoId: number): Promise<void> {
    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        DELETE FROM processos
        WHERE id = $1;
      `;

      const values = [processoId];

      await client.query(query, values);
    } catch (error) {
      throw new Error('Falha ao deletar processo do banco');
    } finally {
      await client.end();
    }
  }

}
