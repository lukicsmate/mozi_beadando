import express from 'express'
import db from '../data/db.js'

const foglalasokDelete = express();
foglalasokDelete.use(express.json())

foglalasokDelete.delete('/foglalasok/:id',async (req,res)=>{
    const id = req.params.id;
    const checkSql = `SELECT id
    FROM foglalasok
    WHERE foglalasok.id = ?
    `
    const [check] = await db.query(checkSql,[id])
    if(check.length === 0){return res.status(404).send("nincs ilyen foglalas")}
    else{
        const sql = `DELETE FROM foglalasok WHERE foglalasok.id = ?`

        db.query(sql,[id])


        return res.status(204).send("Rendelés Törölve");
    }
})
export default foglalasokDelete;