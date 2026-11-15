import express from 'express'
import filmek from './router/filmek.js'
import filmekById from './router/filmekById.js';
import vetitesek from './router/vetitesek.js';
import vetitesekById from './router/vetitesekById.js'
import statisztika from './router/statisztika.js';
import foglalasok from './router/foglalasok.js';
import foglalasokDelete from './router/foglalasokDelete.js';

const app = express();
app.use(express.json())

app.use('/filmek',filmek)
app.use(filmekById)
app.use('/vetitesek',vetitesek)
app.use(vetitesekById)
app.use('/statisztika',statisztika)
app.use('/foglalasok',foglalasok)
app.use(foglalasokDelete)

app.listen(3000,()=>{
    console.log('Server is running on http://localhost:3000');
})