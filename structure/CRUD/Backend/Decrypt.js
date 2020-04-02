// Decrypt file for demo
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/firstdb', { useNewUrlParser:true, useUnifiedTopology: true }, (err, db) => {
    if(!err){
    db.collection("people").find({}).toArray(function(err, result) {
     if (err) throw err;
      console.log(result);
      const fs = require('fs') 
      let data  = JSON.stringify(result);
      fs.writeFile('MongoData.txt', data, (err) => { 
    if (err) throw err; 
  }) 
      db.close();
    });
      console.log('MongoDB connected...')
    } else
    {
        console.log('Error in DB connection: ' + JSON.stringify(err, undefined, 2) );
    }
})
