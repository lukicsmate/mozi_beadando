import express from 'express'
import db from '../data/db.js'
import filmek from './filmek.js';

const vetitesekById = express();
vetitesekById.use(express.json())

vetitesekById.get('/vetitesek/:id',async (req,res)=>{
    const id = req.params.id;

    const idCheck = `SELECT
    id
    FROM vetitesek
    WHERE id = ?
    ` 
    const [Check] = await db.query(idCheck,[id])
    if(Check.length===0){return res.status(404).send("nincs ilyen vetites")}

    const sql = `SELECT
        vetitesek.id,
        filmek.cim AS filmek,
        termek.nev AS terem,
        termek.id AS terem_id,
        termek.sorok AS sorok,
        termek.szekek AS szekek,
        vetitesek.kezdes AS kezdes,
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
    foglalasok.sor,
    foglalasok.szek
    FROM termek
    JOIN vetitesek ON vetitesek.terem_id = termek.id
    JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id
    WHERE vetitesek.id = ?
    `
    const [eredmeny] = await db.query(sql,[id])
    console.log(eredmeny)
    const [terem] = await db.query(teremSQL,[id])
    console.log(terem)
    const vegeredmeny = eredmeny
    .flatMap
    (vetitesek =>
        ({
            id:vetitesek.id,
            filmek:vetitesek.filmek,
            terem:vetitesek.terem,
            kezdes:vetitesek.kezdes,
            jegyAR:vetitesek.jegyar,
            sorok:vetitesek.sorok,
            szekek:vetitesek.szekek,
            foglaltDB:vetitesek.foglalt,
            szabadHely:(vetitesek.sorok * vetitesek.szekek)-vetitesek.foglalt,
            foglalt:terem.map(terem =>
            ({
                sor:terem.sor,
                szek:terem.szek

            }))
            
        })
    )



    
    return res.json(vegeredmeny)
})
export default vetitesekById;