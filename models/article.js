const mongoose = require('mongoose');
const config = require('../config/database');

//Article schema
const ArticleSchema = mongoose.Schema({
    title: {
        type: String
    },
    url: {
        type: String
    }
});

const Article = module.exports = mongoose.model('Article', ArticleSchema);

// get all articles on frontpage of a site
module.exports.getArticles = function(id, callback){
    User.findById(id, callback);
};