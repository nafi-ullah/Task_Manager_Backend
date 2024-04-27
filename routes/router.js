const express = require('express');
const db = require('../DB/dbconnect');

const router = express.Router();

router.get("/users",(req,res)=>{
    const sql = "SELECT * FROM users";
    db.query(sql,(err,data)=>{
        if(err) return res.json("ERROR");

        return res.json(data);
    });
});

module.exports = router;
