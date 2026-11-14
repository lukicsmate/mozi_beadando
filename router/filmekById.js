import express from 'express'
import db from '../data/db.js'

const filmekById = express();
filmekById.use(express.json())

filmekById.get('/filmek/:id',async (req,res)=>{
    const id = req.params.id;
    if(typeof id !== 'number'){return res.status(400)}
    const sql = `SELECT
    cim,
    hossz,
    korhatar,
    COUNT(DISTINCT vetitesek.id) as vetitesDb,
    COUNT(foglalasok.id) as eladottJegy
    FROM filmek
    JOIN vetitesek ON vetitesek.film_id = filmek.id   
    JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id
    WHERE filmek.id = ?
    `
    const [eredmeny] = await db.query(sql,[id])
    if(eredmeny.length === 0){return res.status(404).send("nincs ilyen film")}
    res.json(eredmeny)

})
export default filmekById;