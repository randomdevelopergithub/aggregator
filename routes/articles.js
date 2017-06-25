const express = require('express');
const router = express.Router();

const config = require('../config/database');
const Article = require('../models/article');


// /frontpage
router.get('/', (req,res) => {
    
    
    // grab all latest articles for all news vendors (at this point they will be stored in db, by the collection job that runs in parallel when server started)
    
    res.send("test");
});

module.exports = router;
