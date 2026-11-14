import express from 'express'
import filmek from './router/filmek.js'
import filmekById from './router/filmekById.js';
import vetitesek from './router/vetitesek.js';
import vetitesekById from './router/vetitesekById.js'

const app = express();
app.use(express.json())

app.use('/filmek',filmek)
app.use(filmekById)
app.use('/vetitesek',vetitesek)
app.use(vetitesekById)

app.listen(3000,()=>{
    console.log('Server is running on http://localhost:3000');
})