import express from 'express';
import pageRoutes from './routes/pagesRoutes.js';
import blockRotes from './routes/blockRoutes.js'
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/page', pageRoutes);
app.use('/block', blockRotes);

app.listen(3000, () => {
    console.log('Server is running');
})