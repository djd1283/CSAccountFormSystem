const mongoose = require('mongoose');

/* My modifications */

var Schema = mongoose.Schema;
var mySchema = new Schema({
    first_name:{type : String},
    last_name:{type: String},
    mail:{type : String},
    major:{type : String},
    student_id:{type: String},
    completion_year:{type: String},
    course_number:{type: String},
    prev_username:{type: String},
});
 
var Person = mongoose.model('Person', mySchema);
 
 module.exports = {Person}