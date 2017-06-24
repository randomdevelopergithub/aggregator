const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const config = require('../config/database');

//user schema
const ArticleSchema = mongoose.Schema({
    title: {
        type: String
    },
    date_published:{
        type: String
    }
});
