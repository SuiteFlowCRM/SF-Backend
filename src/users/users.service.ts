import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class UserService {

  private dbConfig = databaseConfig;



  async incrementAtividade(userId: number, atividadeValue: number): Promise<any> {
    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE users
        SET atividade = atividade + $1
        WHERE id = $2
        RETURNING *;
      `;

      const values = [atividadeValue, userId];

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

  async createUser(userData: any): Promise<any> {
    const {
      login,
      name,
      email,
      adress,
      city,
      estado,
      cep,
      fone,
      empresa,
      tipo_participante,
      lista_afilhados,
      entidade_preference,
      meta,
    } = userData;

    const client = new Client(this.dbConfig);

    try {
      await client.connect();

      // Consulta para obter o valor de "users" da empresa
      const empresaQuery = 'SELECT users FROM empresas WHERE id = $1';
      const empresaResult = await client.query(empresaQuery, [empresa]);
      const empresaUsers = empresaResult.rows[0].users;

      // Consulta para contar os usuários com o mesmo id_empresa
      const countUsersQuery = 'SELECT COUNT(*) FROM users WHERE empresa = $1';
      const countUsersResult = await client.query(countUsersQuery, [empresa]);
      const userCount = countUsersResult.rows[0].count;


      if (userCount <= empresaUsers) {
        const insertQuery = `
          INSERT INTO users (
            login,
            name,
            email,
            adress,
            city,
            estado,
            cep,
            fone,
            empresa,
            tipo_participante,
            lista_afilhados,
            entidade_preference,
            meta
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          ) RETURNING *;
        `;

        const values = [
          login,
          name,
          email,
          adress,
          city,
          estado,
          cep,
          fone,
          empresa,
          tipo_participante,
          lista_afilhados,
          entidade_preference,
          meta,
        ];

        const result = await client.query(insertQuery, values);

        return result.rows[0];
      } else {
        throw new Error('Limite de usuários atingido para a empresa');
      }

     } catch (error) {
       console.error('Informações do erro ao criar usuário:', error);
       throw error;
     } finally {
       await client.end();
    }


  }


  // async createUser(userData: any): Promise<any> {
  //   const { login, name, email, adress, city, estado, cep, fone, empresa, tipo_participante, lista_afilhados, entidade_preference, meta } = userData;

  //   const client = new Client(this.dbConfig);

  //   try {
  //     await client.connect();

  //     const query = `
  //       INSERT INTO users (
  //         login,
  //         name,
  //         email,
  //         adress,
  //         city,
  //         estado,
  //         cep,
  //         fone,
  //         empresa,
  //         tipo_participante,
  //         lista_afilhados,
  //         entidade_preference,
  //         meta
  //       ) VALUES (
  //         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
  //       ) RETURNING *;
  //     `;

  //     const values = [
  //       login,
  //       name,
  //       email,
  //       adress,
  //       city,
  //       estado,
  //       cep,
  //       fone,
  //       empresa,
  //       tipo_participante,
  //       lista_afilhados,
  //       entidade_preference,
  //       meta
  //     ];

  //     const result = await client.query(query, values);

  //     return result.rows[0];
  //   } catch (error) {
  //     console.error('Informações do erro ao criar  usuário:', error);

  //   } finally {
  //     await client.end();
  //   }
  // }


  async findAllFilteredUsers(login: string): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      query = `
      SELECT * FROM users 
      WHERE login = $1 COLLATE "C"
    `;

      const result = await client.query(query, [login]);

      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar os usuários no banco');
    } finally {
      await client.end();
    }
  }



  async findAllFiltered(empresa: string): Promise<any[]> {
    const client = new Client(this.dbConfig);

    try {
      await client.connect();
      let query = '';

      query = `
        SELECT * FROM users 
        WHERE empresa = '${empresa}' COLLATE "C"
      `;


      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar os usuários no banco');
    } finally {
      await client.end();
    }
  }


  async updateUser(userId: number, updatedUserData: any): Promise<any> {
    const {
      name,
      email,
      adress,
      city,
      estado,
      cep,
      fone,
      empresa,
      tipo_participante,
      lista_afilhados,
      entidade_preference,
      avatar,
      meta,
      meta_grupo,
      lista_processos
    } = updatedUserData;

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE users
        SET
          name = $1,
          email = $2,
          adress = $3,
          city = $4,
          estado = $5,
          cep = $6,
          fone = $7,
          empresa = $8,
          tipo_participante = $9,
          lista_afilhados = $10,
          entidade_preference = $11,
          avatar = $12,
          meta = $13,
          meta_grupo = $14,
          lista_processos = $15
        WHERE
          id = $16
        RETURNING *;
      `;

      const values = [
        name,
        email,
        adress,
        city,
        estado,
        cep,
        fone,
        empresa,
        tipo_participante,
        lista_afilhados,
        entidade_preference,
        avatar,
        meta,
        meta_grupo,
        lista_processos,
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

}
