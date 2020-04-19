// Decrypt file for demo
const mongoose = require('mongoose')
const fs = require('fs')
var key, iv, text, keyObj;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var os = require('os');

mongoose.connect('mongodb://localhost:27017/CSFormdb', { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (!err) {
        db.collection("people").find({}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result);

            let data = JSON.stringify(result);
            var dataObj = JSON.parse(data);
           // console.log(dataObj[0].first_name);

             decryption(dataObj);

            fs.writeFile('CSMongoData.txt', data, (err) => {
                if (err) throw err;
            }) 
            db.close();
        }); 
        console.log('MongoDB connected...')
    } else {
        console.log('Error in DB connection: ' + JSON.stringify(err, undefined, 2));
    }
})

function decryption(encrypted) {
    var first_name_e, last_name_e, mail_e, major_e, student_id_e, completion_year_e, course_number_e, prev_username_e
    var first_name, last_name, mail, major, student_id, completion_year, course_number, prev_username
    fs.readFile('AESKey.txt', 'utf8', function (err, keyring) {
        if (err) throw err;
        keyObj = JSON.parse(keyring);
        key = keyObj.key, iv = keyObj.iv;
        //   console.log(keyObj.key);

        for (var i = 0; i < encrypted.length; ++i) {

            first_name_e = { iv: iv, encryptedData: encrypted[i].first_name }
            first_name = decrypt(first_name_e);
//            console.log(first_name);
            last_name_e = { iv: iv, encryptedData: encrypted[i].last_name }
            last_name = decrypt(last_name_e);            
            mail_e = { iv: iv, encryptedData: encrypted[i].mail }
            mail = decrypt(mail_e);
            major_e = { iv: iv, encryptedData: encrypted[i].major }
            major = decrypt(major_e);
            student_id_e = { iv: iv, encryptedData: encrypted[i].student_id }
            student_id = decrypt(student_id_e);
            completion_year_e = { iv: iv, encryptedData: encrypted[i].completion_year }
            completion_year = decrypt(completion_year_e);
            course_number_e = { iv: iv, encryptedData: encrypted[i].course_number }
            course_number = decrypt(course_number_e);
            prev_username_e = { iv: iv, encryptedData: encrypted[i].prev_username }
            prev_username = decrypt(prev_username_e); 
           let data = { ID: encrypted[i]._id, FirstName: first_name, LastName: last_name, Email: mail, Major: major, Student_ID: student_id, CompletionYear: completion_year, CourseNumber: course_number, PrevUserName: prev_username };
            console.log(data);
            fs.appendFile('CSDecryptedData.txt', JSON.stringify(data) + os.EOL, (err) => {
                if (err) throw err;
            })  
        }
    });
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}