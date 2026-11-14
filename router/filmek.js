import express from 'express'
import db from '../data/db.js'

const filmek = express();
filmek.use(express.json())

filmek.get('/',async (req,res)=>{
    const sql =`SELECT
    cim,
    hossz,
    korhatar,
    COUNT(DISTINCT vetitesek.id) as vetitesDb,
    COUNT(foglalasok.id) as eladottJegy
    FROM filmek
    JOIN vetitesek ON vetitesek.film_id = filmek.id   
    JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id
    GROUP by filmek.cim`;
    const [eredmenyek] = await db.query(sql);
    res.json(eredmenyek);
})
export default filmek;