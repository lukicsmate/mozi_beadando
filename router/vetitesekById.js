import express from 'express'
import db from '../data/db.js'
import filmek from './filmek.js';

const vetitesekById = express();
vetitesekById.use(express.json())

vetitesekById.get('/vetitesek/:id',async (req,res)=>{
    const id = req.params.id;
    const sql = `SELECT
        vetitesek.id,
        filmek.cim AS filmek,
        termek.nev AS terem,
        termek.id AS terem_id,
        termek.sorok AS sorok,
        termek.szekek AS szekek,
        DATE_FORMAT(vetitesek.kezdes, '%H:%i:%s') AS kezdes,
        vetitesek.jegyar,
        filmek.hossz as hossz,
        COUNT(foglalasok.id) AS foglalt
        FROM vetitesek
        JOIN termek ON termek.id = vetitesek.terem_id
        JOIN filmek ON filmek.id = vetitesek.film_id
        JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id
        WHERE vetitesek.id = ?
    `
    const teremSQL = `SELECT
    sorok,
    szekek
    FROM termek
    JOIN vetitesek ON vetitesek.terem_id = termek.id
    WHERE vetitesek.id = ?
    `
    const [eredmeny] = await db.query(sql,[id])
    const [terem] = await db.query(teremSQL,[id])

    const vegeredmeny = eredmeny
    .map(vetitesek =>{
        terem.map(terem =>
        ({
            id:vetitesek.id,
            filmek:vetitesek.filmek,
            terem:vetitesek.terem,
            kezdes:vetitesek.kezdes,
            jegyAR:vetitesek.jegyar,
            sorok:terem.sorok,
            szekek:terem.szekek,

            foglalt:{terem}
        }))



    })
    return res.json(vegeredmeny)
})
export default vetitesekById;