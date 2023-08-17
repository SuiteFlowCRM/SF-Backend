import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class ParticipanteService {

  private dbConfig = databaseConfig;


    async  createParticipante(userData: any): Promise<any> {
    const { id_user, name, identidade, email, adress, city, estado, cep, fone, tipo_participante } = userData;
  
    const client = new Client(this.dbConfig);
  
    try {
      await client.connect();
  
      const query = `
        INSERT INTO participantes (
          id_user,
          name,
          identidade,
          email,
          adress,
          city,
          estado,
          cep,
          fone,
          tipo_participante
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *;
      `;
  
      const values = [
        id_user,
        name,
        identidade,
        email,
        adress,
        city,
        estado,
        cep,
        fone,
        tipo_participante
      ];
  
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error('Informações do erro ao criar  participante:', error);

    } finally {
      await client.end();
    }
  }

  async updateParticipante(userId: number, updatedUserData: any): Promise<any> {
    const {
      id_user,
      name,
      identidade,
      email,
      adress,
      city,
      estado,
      cep,
      fone
    } = updatedUserData;

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE participantes
        SET
          id_user = $1,
          name = $2,
          identidade = $3,
          email = $4,
          adress = $5,
          city = $6,
          estado = $7,
          cep = $8,
          fone = $9
        WHERE
          id = $10
        RETURNING *;
      `;

      const values = [
        id_user,
        name,
        identidade,
        email,
        adress,
        city,
        estado,
        cep,
        fone,
        userId
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];

    } catch (error) {
      throw new Error('Falha ao atualizar usuário');
    } finally {
      await client.end();
    }
  }

  async findAllFiltered( id_user: string ): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      query = `
        SELECT * FROM participantes 
        WHERE id_user = '${id_user}' COLLATE "C"
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar os usuários no banco');
    } finally {
      await client.end();
    }
  }

  async deleteParticipante(participanteId: number): Promise<void> {
    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        DELETE FROM participantes
        WHERE id = $1;
      `;

      const values = [participanteId];

      await client.query(query, values);
    } catch (error) {
      throw new Error('Falha ao deletar participante');
    } finally {
      await client.end();
    }
  }

}
