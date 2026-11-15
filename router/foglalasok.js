import express from 'express'
import db from '../data/db.js'

const foglalasok = express();
foglalasok.use(express.json())

foglalasok.post('/',async (req,res)=>{
    const vetitesId = req.body.vetitesId;
    const nev = req.body.nev;
    const sor = req.body.sor;
    const szek = req.body.szek;


    const checkSql = `SELECT (termek.sorok * termek.szekek) - COUNT(foglalasok.id) AS ferohely,
     termek.sorok AS sorok,
     termek.szekek AS szekek
     FROM vetitesek
     JOIN termek ON termek.id = vetitesek.terem_id
     LEFT JOIN foglalasok foglalasok ON foglalasok.vetites_id = vetitesek.id
     WHERE vetitesek.id = ?
    `
    const [check] = await db.query(checkSql,[vetitesId])
    console.log(check)
    if(check[0].ferohely == 0){return res.status(409).send("telt ház: a Klubterem mind a 8 helye foglalt")}
    
    const SelectSql = `SELECT 
        filmek.id AS filmId,
        termek.id AS teremId,
        vetitesek.kezdes AS kezdes,
        vetitesek.jegyar AS jegyar,
        termek.sorok AS sorok,
        termek.szekek AS szekek
        FROM vetitesek
        JOIN termek ON vetitesek.terem_id = termek.id
        JOIN filmek ON vetitesek.film_id = filmek.id
        WHERE vetitesek.id = ?
        `
    const [select] = await db.query(SelectSql,[vetitesId])
    if(select.length === 0){return res.status(404).send("nincs ilyen vetites")}


    const foglaltCheck = `SELECT
    *
    FROM foglalasok
    WHERE foglalasok.sor = ? AND foglalasok.szek = ?  AND foglalasok.vetites_id = ?   
    `
    const [foglalt] = await db.query(foglaltCheck,[sor,szek,vetitesId])
    
    if(foglalt.length===0){ 



        if(check[0].sorok > select[0].sorok){return res.status(409).send(`a Klubteremben csak ${select[0].sorok} sor van`)}
        const postSql = `INSERT INTO foglalasok(vetites_id,nev,sor,szek)
        VALUES(?,?,?,?)
        `
        const [post] = await db.query(postSql,[vetitesId,nev,sor,szek])
        
        return res.status(201).json({
            id: post.insertId,
            vetitesId,
            nev,
            sor,
            szek
        })
    }
    else{
        return res.status(409).send("a hely már foglal")
    }


})

export default foglalasok;