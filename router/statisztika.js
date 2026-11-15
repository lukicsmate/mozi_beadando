import express from 'express'
import db from '../data/db.js'

const statisztika = express();
statisztika.use(express.json())

statisztika.get('/filmek',async (req,res)=>{
    const sql = `SELECT
    film,
    SUM(eladottJegy) AS eladottJegy,
    SUM(eladottJegy * jegyar) AS bevetel,
    NULLIF(ROUND(
        SUM(eladottJegy) * 100.0 / SUM(kapacitas),
        2
    ),0.00) AS telitettseg
    FROM (
        SELECT
            filmek.cim AS film,
            vetitesek.id AS vetites_id,
            vetitesek.jegyar AS jegyar,
            termek.sorok * termek.szekek AS kapacitas,
            COUNT(foglalasok.id) AS eladottJegy
        FROM vetitesek
        JOIN filmek ON vetitesek.film_id = filmek.id
        JOIN termek ON vetitesek.terem_id = termek.id
        LEFT JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id
        GROUP BY
            filmek.cim,
            vetitesek.id,
            vetitesek.jegyar,
            termek.sorok,
            termek.szekek
    ) AS adatok
    GROUP BY film;
    `
    const [eredmeny] = await db.query(sql);
    res.json(eredmeny)
})
export default statisztika;