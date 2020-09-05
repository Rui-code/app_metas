import { Request, Response, response } from 'express';
import db from '../database/connection';

export default class UnidadesController {

    static async index(request: Request, response: Response) {
        const unidades = await db('_0001info_unidades').select('*');
        return response.json(unidades);
    }

    static async getOne(request: Request, response: Response) {
        const unidade = await db('_0001info_unidades')
            .where('cod_unidade', '=', request.params.id)
            .select('*');
        return response.json(unidade);
    }

    static async create(request: Request, response: Response) {

        const { 
            cod_unidade, 
            nome_unidade, 
            qtd_funcionarios, 
            meta_unidade } = request.body;

        const trx = await db.transaction();

        try {
            await trx('_0001info_unidades').insert({
                cod_unidade, 
                nome_unidade, 
                qtd_funcionarios, 
                meta_unidade
            });

        trx.commit();

        return response.status(201).json({ message: `A unidade ${nome_unidade} foi criada com sucesso` }).send();

        } catch (error) {
            console.log(error);
            trx.rollback();
            return response.status(400).json({
                error: 'Erro inesperado ao criar a unidade',
            });
        }
        
    }
}