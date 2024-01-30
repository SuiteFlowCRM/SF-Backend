import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class EmpresasService {

  private dbConfig = databaseConfig;

  async findEmpresa(empresa: string): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      query = `
        SELECT * FROM empresas 
        WHERE id = '${empresa}' COLLATE "C"
      `;


      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar empresa no banco');
    } finally {
      await client.end();
    }
  }


}
