import { Request, Response } from 'express';
import db from '../database/connection';

export default class UsersMetaController {

    static async index(request: Request, response: Response) {
        const colaborador = await db('_0001metas').select('*');
        return response.json(colaborador);
    }

    static async getOne(request: Request, response: Response) {
        const userMeta = await db('_0001metas')
            .where('codigo_colaborador', '=', request.params.id)
            .select('*');
        return response.json(userMeta);
    }

    static async create(request: Request, response: Response) {

        const { 
            codigo_colaborador, 
            nome_colaborador, 
            meta_colaborador, 
            unidade_operacional } = request.body;

        const [{qtd_funcionarios}] = await db('_0001info_unidades')
            .where('cod_unidade', '=', unidade_operacional)
            .select('qtd_funcionarios');

        const [{meta_unidade}] = await db('_0001info_unidades')
            .where('cod_unidade', '=', unidade_operacional)
            .select('meta_unidade');

        const novaUnidadeQuantidade = qtd_funcionarios + 1;
        const novaMetaUnidade = meta_unidade + meta_colaborador;

        const trx = await db.transaction();

        try {
            
            await trx('_0001metas').insert({
                codigo_colaborador, 
                nome_colaborador, 
                meta_colaborador, 
                unidade_operacional
            });

            await trx('_0001info_unidades')
            .where('cod_unidade', '=', unidade_operacional)
            .update({
                qtd_funcionarios: novaUnidadeQuantidade,
                meta_unidade: novaMetaUnidade,
            })

            await trx.commit();

            return response.status(201).json({ message: `A meta do colaborador ${nome_colaborador} foi cadastrada com sucesso` }).send();

        } catch (error) {
            console.log(error);
            trx.rollback();
            return response.status(400).json({
                error: 'Erro inesperado ao criar a meta',
            });
        }
    }

    static async update(request: Request, response: Response){

        const { 
            codigo_colaborador, 
            nome_colaborador, 
            meta_colaborador, 
            unidade_operacional } = request.body;

        const [{meta_unidade}] = await db('_0001info_unidades')
            .where('cod_unidade', '=', unidade_operacional)
            .select('meta_unidade');

        const [meta_antiga] = await db('_0001metas')
            .where('codigo_colaborador', '=', codigo_colaborador)
            .select('meta_colaborador');

        const metaAjustada = meta_unidade - meta_antiga.meta_colaborador;
        const metaFinal = metaAjustada + meta_colaborador;

        const trx = await db.transaction();

        try {
            
            await trx('_0001metas')
                .where('codigo_colaborador', '=', codigo_colaborador)
                .update({
                    meta_colaborador,
                })

            await trx('_0001info_unidades')
                .where('cod_unidade', '=', unidade_operacional)
                .update({
                    meta_unidade: metaFinal,
                })
            
            await trx.commit();

            return response.status(200).json({ message: `A meta do colaborador ${nome_colaborador} foi atualizada com sucesso` }).send();

        } catch (error) {
            console.log(error);
            trx.rollback();
            return response.status(400).json({
                error: 'Erro inesperado ao atualizar a meta',
            });
        }

    }

    static async delete(request: Request, response: Response) {

        const { 
            codigo_colaborador, 
            nome_colaborador, 
            meta_colaborador, 
            unidade_operacional } = request.body;

        const [{qtd_funcionarios}] = await db('_0001info_unidades')
            .where('cod_unidade', '=', unidade_operacional)
            .select('qtd_funcionarios');

        const [{meta_unidade}] = await db('_0001info_unidades')
            .where('cod_unidade', '=', unidade_operacional)
            .select('meta_unidade');

        const trx = await db.transaction();

        const novaUnidadeQuantidade = qtd_funcionarios + 1;
        const novaMetaUnidade = meta_unidade - meta_colaborador;

        try {
            await trx('_0001metas')
            .where('codigo_colaborador', '=', codigo_colaborador)
            .del()

            await trx('_0001info_unidades')
                .where('cod_unidade', '=', unidade_operacional)
                .update({
                    qtd_funcionarios: novaUnidadeQuantidade,
                    meta_unidade: novaMetaUnidade,
                })

            await trx.commit();

            return response.status(200).json({ message: `A meta do colaborador ${nome_colaborador} foi excluída com sucesso` }).send();

        } catch (error) {
            console.log(error);
            trx.rollback();
            return response.status(400).json({
                error: 'Erro inesperado ao excluir a meta',
            });
        }

    }

}