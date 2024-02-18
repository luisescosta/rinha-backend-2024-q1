import 'dotenv/config'
import express from 'express';
import { envs } from './config';
import { AppContainer } from './container';
export class Application {
    async bootstrap() {
        const PORT = envs.port
        
        const app = express();
        app.use(express.json())

        const container = await new AppContainer().init();
        const { transactionsController } = container;
        app.post('/clientes/:id/transacoes', transactionsController.create);
        app.get('/clientes/:id/extrato', transactionsController.findById);

        app.listen(PORT, () => console.log(`\n[LOG] server is running in PORT: ${PORT}\n`));       
    }
}