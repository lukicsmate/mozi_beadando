import express from 'express'
import db from '../data/db.js'
import filmek from './filmek.js';

const vetitesek = express();
vetitesek.use(express.json())


function minutesToTime(totalMinutes) {
    const minutesInDay = 24 * 60;
    const timeOfDay = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
    const hours = Math.floor(timeOfDay / 60);
    const minutes = timeOfDay % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
vetitesek.get('/',async (req,res) =>{
    const datum = req.query.datum;

    const sql = `SELECT
    vetitesek.id,
    filmek.cim AS filmek,
    termek.nev AS terem,
    termek.sorok AS sorok,
    termek.szekek AS szekek,
    DATE_FORMAT(vetitesek.kezdes, '%H:%i') AS kezdes,
    vetitesek.kezdes AS kezdesDatum,
    vetitesek.jegyar,
    filmek.hossz as hossz,
    COUNT(foglalasok.id) AS foglalt

    FROM vetitesek
    JOIN termek ON termek.id = vetitesek.terem_id
    JOIN filmek ON filmek.id = vetitesek.film_id
    JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id
    GROUP BY vetitesek.id
    `
    const [eredmenyek] = await db.query(sql)


    const vegeredmeny = eredmenyek.map(eredmeny => 
    ( 
        {
        id:eredmeny.id,
        filmek:eredmeny.filmek,
        terem:eredmeny.terem,
        kezdes:eredmeny.kezdesDatum,
        veg:minutesToTime(timeToMinutes(eredmeny.kezdes)+eredmeny.hossz),
        jegyAr:eredmeny.jegyar,
        szabadhely:(eredmeny.sorok * eredmeny.szekek) - eredmeny.foglalt
    }))
    return res.json(vegeredmeny)
})
export default vetitesek;