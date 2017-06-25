const Article = require('../models/article.js');
const vendors = require('../config/vendors.js');
const request = require('request');
const cheerio = require('cheerio');
    
module.exports = function(agenda) {
    agenda.define('retrieve articles', function(job, done) {
        //console.log(job);
      
        // here pull articles from all in news vendor domain array.
        // save articles by domain in db
        for(vendor of vendors.list){
            console.log(vendor);
          
            request(vendor.domain, (err, response, html) => {
                if(err){
                    console.log("retrieval from " + vendor.domain + " failed.");
                }
              
                $ = cheerio.load(html);
                let links = $('a'); //jquery get all hyperlinks
                $(links).each(function(i, link){
                    console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                });
                              
            })
        }
      
        done();
    });
     
    agenda.on('ready', function() {
      agenda.every('10 seconds', 'retrieve articles');
      console.log("starting job");
      agenda.start();
    });
}