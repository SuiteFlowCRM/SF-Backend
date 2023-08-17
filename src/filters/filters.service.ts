import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class FiltersService {

  private dbConfig = databaseConfig;

  async createOrUpdateFilter(filterData: any): Promise<any> {
    const { id_user, number, status, periodo, grupo } = filterData;
  
    const client = new Client(this.dbConfig);
  
    try {
      await client.connect();
  
      // Check if a filter with the same number and id_user exists
      const existingFilterQuery = `
        SELECT * FROM filters
        WHERE number = $1 AND id_user = $2;
      `;
      const existingFilterResult = await client.query(existingFilterQuery, [number, id_user]);
  
      if (existingFilterResult.rows.length > 0) {
        // Update the existing filter
        const updateQuery = `
          UPDATE filters
          SET
            status = $1,
            periodo = $2,
            grupo = $3
          WHERE
            id_user = $4 AND number = $5
          RETURNING *;
        `;
        const updateValues = [
          status,
          periodo,
          grupo,
          id_user,
          number
        ];
  
        const result = await client.query(updateQuery, updateValues);
        return result.rows[0];
      } else {
        // Insert a new filter
        const insertQuery = `
          INSERT INTO filters (
            id_user,
            number,
            status,
            periodo,
            grupo
          ) VALUES (
            $1, $2, $3, $4, $5
          ) RETURNING *;
        `;
        const insertValues = [
          id_user,
          number,
          status,
          periodo,
          grupo
        ];
  
        const result = await client.query(insertQuery, insertValues);
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error creating/updating filter:', error);
    } finally {
      await client.end();
    }
  }
  

  async findAllFiltered(id_user: string): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      query = `
        SELECT * FROM filters 
        WHERE id_user = '${id_user}' COLLATE "C"
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar os filtros no banco');
    } finally {
      await client.end();
    }
  }

  async deleteFilter(userId: number, filterNumber: string): Promise<void> {
    const client = new Client(this.dbConfig);
    try {
      await client.connect();
  
      const query = `
        DELETE FROM filters
        WHERE id_user = $1 AND number = $2;
      `;
  
      const values = [userId, filterNumber];
  
      await client.query(query, values);
    } catch (error) {
      throw new Error('Falha ao deletar filtro');
    } finally {
      await client.end();
    }
  }

}
