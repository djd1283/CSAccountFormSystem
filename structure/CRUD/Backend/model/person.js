const mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
//var SALT_WORK_FACTOR = 10;

/* My modifications */

var Schema = mongoose.Schema;
var mySchema = new Schema({
    name:{type : String},
    mail:{type : String},
    class:{type : Number}
});
 
var Person = mongoose.model('Person', mySchema);
 
/* mySchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('name')) return next();
 
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
 
        bcrypt.hash(user.name, salt, function(err, hash){
            if(err) return next(err);
 
            user.name = hash;
            
            next();
        });
    });
});
*/

/* Original program
var Person = mongoose.model('Person',{
    name:{type : String},
    mail:{type : String},
    class:{type : Number}
}) */

 module.exports = {Person}