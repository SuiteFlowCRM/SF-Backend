import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class ProductsService {

  private dbConfig = databaseConfig;

  async createProduct(newProduct: any): Promise<any> {
    const { empresa, name, codigo, cor, valor, unidade_medida, ipi, converter,peso, tamanho, seguimento } = newProduct;

    const client = new Client(this.dbConfig);

    try {
      await client.connect();


      const query = `
        INSERT INTO produtos (
          empresa,
          name,
          codigo,
          cor,
          valor,
          unidade_medida,
          ipi,
          converter,
          peso,
          tamanho,
          seguimento
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        ) RETURNING *;
      `;

      const values = [
        empresa,
        name,
        codigo,
        cor,
        valor,
        unidade_medida,
        ipi,
        converter,
        peso,
        tamanho,
        seguimento,
      ];

      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Informações do erro ao criar  produto:', error);
      //throw new Error('Failed to create card');
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
        SELECT * FROM produtos 
        WHERE empresa = '${empresa}' COLLATE "C"
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Falha ao buscar os produtos no banco');
    } finally {
      await client.end();
    }
  }

  async updateProduct(productId: number, updatedProductData: any): Promise<any> {
    const {
      name,
      codigo,
      cor,
      valor,
      unidade_medida,
      ipi,
      converter,
      peso,
      tamanho,
      seguimento,
      variante,
      codigo_ext,
    } = updatedProductData;

    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        UPDATE produtos
        SET
          name = $1,
          codigo = $2,
          cor = $3,
          valor = $4,
          unidade_medida = $5,
          ipi = $6,
          converter = $7,
          peso = $8,
          tamanho = $9,
          seguimento = $10,
          variante = $11,
          codigo_ext = $12
        WHERE
          id = $13
        RETURNING *;
      `;

      const values = [
        name,
        codigo,
        cor,
        valor,
        unidade_medida,
        ipi,
        converter,
        peso,
        tamanho,
        seguimento,
        variante,
        codigo_ext,
        productId,
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Card not found');
      }

      return result.rows[0];

    } catch (error) {
      throw new Error('Falha ao atualizar produto');
    } finally {
      await client.end();
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    const client = new Client(this.dbConfig);
    try {
      await client.connect();

      const query = `
        DELETE FROM produtos
        WHERE id = $1;
      `;

      const values = [productId];

      await client.query(query, values);
    } catch (error) {
      throw new Error('Falha ao deletar produto do banco');
    } finally {
      await client.end();
    }
  }

}
