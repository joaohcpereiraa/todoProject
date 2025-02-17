import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';

import config from '../../../config';
import ITaskController from '../../controllers/IControllers/ITaskController';

const route = Router();

export default (app: Router) => {
    app.use('/tasks', route);

    const ctrl = Container.get(config.controllers.task.name) as ITaskController;

    route.post(
        '/create',
        celebrate({
            body: Joi.object({
                title: Joi.string().required(),
                completed: Joi.boolean().optional()
            }),
        }),
        async (req, res, next) => {
            try {
                await ctrl.createTask(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.get(
        '/list',
        async (req, res, next) => {
            try {
                await ctrl.listTasks(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.put(
        '/update/:id',
        celebrate({
            body: Joi.object({
                title: Joi.string().optional(),
                completed: Joi.boolean().optional()
            }),
            params: Joi.object({
                id: Joi.string().required()
            })
        }),
        async (req, res, next) => {
            try {
                await ctrl.updateTask(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.delete(
        '/remove/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required()
            })
        }),
        async (req, res, next) => {
            try {
                await ctrl.removeTask(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );
};