import express from 'express';
import pageRoutes from './routes/pagesRoutes.js';
import blockRotes from './routes/blockRoutes.js'

const app = express();
app.use(express.json());

app.use('/page', pageRoutes);
app.use('/block', blockRotes);

app.listen(3000, () => {
    console.log('Server is running');
})