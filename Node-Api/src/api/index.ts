import { errors } from 'celebrate';
import task from './routes/taskRoute';
import { Router } from 'express';

export default () => {
    const app = Router();

    task(app);

    app.use(errors());

    app.use((err, req, res, next) => {
        if (err.joi) {
            res.status(400).json({
                type: err.type,
                message: err.joi.message,
                details: err.joi.details
            });
        } else {
            next(err);
        }
    });

    return app;
};

