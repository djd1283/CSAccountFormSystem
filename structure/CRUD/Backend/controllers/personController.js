const express = require('express')
var router = express.Router()
var index = 0;
var os = require('os');
var results = []
const fs = require('fs')
var forge = require('node-forge');
var rsa = forge.pki.rsa;
var RSA_E_IV1, RSA_E_Key1
var nodemailer = require('nodemailer');


var { Person } = require('../model/person.js')
var ObjectId = require('mongoose').Types.ObjectId

router.get('/', (req, res) => {
    Person.find((err, doc) => {
        if (!err) { res.send(doc) }
        else { console.log('Error in retrieving persons' + JSON.stringify(err, undefined, 2)); }
    })
})

<<<<<<< HEAD
router.post('/', (req, res) => {
=======
router.post('/',(req,res) => {
>>>>>>> d15c00f3b2ac68e916661eb8c7beea907cad1243

    // req.body.secret_key and req.body.iv should be decrypted with server private key
    // then the secret key and iv should be used to decrypte all person data fields
    // before re-encrypting and sending to the database
    // this should use node-forge

<<<<<<< HEAD
    // RSA Decryption of AES Key1 + AES_Decryption of data
    RSA_E_IV1 = req.body.iv
    RSA_E_Key1 = req.body.secret_key
    var D_AES_Key1 = keypair.privateKey.decrypt(RSA_E_Key1);
    var D_AES_IV1 = keypair.privateKey.decrypt(RSA_E_IV1);

    var per = new Person({
        first_name: decrypt_aes(req.body.first_name, D_AES_IV1, D_AES_Key1),
        last_name: decrypt_aes(req.body.last_name, D_AES_IV1, D_AES_Key1),
        mail: decrypt_aes(req.body.mail, D_AES_IV1, D_AES_Key1),
        major: decrypt_aes(req.body.major, D_AES_IV1, D_AES_Key1),
        student_id: decrypt_aes(req.body.student_id, D_AES_IV1, D_AES_Key1),
        completion_year: decrypt_aes(req.body.completion_year, D_AES_IV1, D_AES_Key1),
        course_number: decrypt_aes(req.body.course_number, D_AES_IV1, D_AES_Key1),
        prev_username: decrypt_aes(req.body.prev_username, D_AES_IV1, D_AES_Key1),
    });

    // Ajith's Nodemailer
    const mailOptions = {
        from: `"Ajith", "ajithchowdary_attanti@student.uml.edu"`,
        to: per.mail,
          subject: "CS Account Registartion ",
        html: "<h4>Hello " + per.first_name + ",</h4><p>Thanks for creating the CS account, the details of the user id and default password will be send to mail soon. If you are not the recipient of this, please contact help@cs.uml.edu </p>"
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
      
        console.log('Message sent: ' + info.response);
      });
   

    // by this point, per should be decrypted using private key and secret key AES


    Person.findOne({ 'mail': encrypt(per.mail) }, (err, docs) => {
        // console.log('Name, email:', per.first_name, per.mail)

        // reenable this to allow encryption between server and MongoDB

        // encrypt all data fields as input to the database (with AES KEY 2)
        if (per.first_name != null) {per.first_name = encrypt(per.first_name);}
        if (per.last_name != null) {per.last_name = encrypt(per.last_name);}
        if (per.mail != null) {per.mail = encrypt(per.mail);}
        if (per.major != null) {per.major = encrypt(per.major);}
        if (per.student_id != null) {per.student_id = encrypt(per.student_id.toString('utf8'));}
        if (per.completion_year != null) {per.completion_year = encrypt(per.completion_year.toString('utf8'));}
        if (per.course_number != null) {per.course_number = encrypt(per.course_number.toString('utf8'));}
        if (per.prev_username != null) {per.prev_username = encrypt(per.prev_username);}
        if (per.class != null) {per.class = encrypt(per.class.toString());}

        if (!docs) {
            per.save((err, doc) => {
                if (!err) {
                    // console.log('doc', doc);

                    res.status(200).send({ auth: true, doc, message: "1 documents inserted!" });
=======
    var per = new Person({
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        mail : req.body.mail,
        major : req.body.major,
        student_id : req.body.student_id,
        completion_year : req.body.completion_year,
        course_number : req.body.course_number,
        prev_username : req.body.prev_username,
    });

    // by this point, per should be decrypted using private key and secret key AES


    Person.findOne({'mail':req.body.mail}, (err, docs) => {
        console.log('Name, email:', per.first_name, per.mail)

        // reenable this to allow encryption between server and MongoDB

        // encrypt all data fields as input to the database
        // if (per.first_name != null) {per.first_name = encrypt(per.first_name);}
        // if (per.last_name != null) {per.last_name = encrypt(per.last_name);}
        // if (per.mail != null) {per.mail = encrypt(per.mail);}
        // if (per.major != null) {per.major = encrypt(per.major);}
        // if (per.student_id != null) {per.student_id = encrypt(per.student_id.toString('utf8'));}
        // if (per.completion_year != null) {per.completion_year = encrypt(per.completion_year.toString('utf8'));}
        // if (per.course_number != null) {per.course_number = encrypt(per.course_number.toString('utf8'));}
        // if (per.prev_username != null) {per.prev_username = encrypt(per.prev_username);}
        //per.class = encrypt(per.class.toString());
    
        if (!docs) {
            per.save((err, doc) => {
                if(!err){                    
                    console.log('doc', doc);

                    res.status(200).send({ auth: true, doc, message:"1 documents inserted!" });
>>>>>>> d15c00f3b2ac68e916661eb8c7beea907cad1243
                    // if (per.first_name != null && per.last_name != null && per.mail != null) {
                    //     console.log("encrypted: ", doc.first_name, "decrypted: ", decrypt(encryptedText[0]));
                    //     // console.log("encrypted: ", doc.last_name, "decrypted: ", decrypt(per.last_name));
                    //     console.log("encrypted: ", doc.mail, "decrypted: ", decrypt(encryptedText[1]))
                    //     encryptedText[0] = 0, encryptedText[1] = 0
                    // }
                    // else {
                    //     console.log('Certain field values not available for encryption');
                    // }
<<<<<<< HEAD
                }
                else {
                    console.log('Error in user inserting data' + JSON.stringify(err, undefined, 2));
                }
=======
                }
                else { 
                    console.log('Error in user inserting data' + JSON.stringify(err, undefined, 2)); 
                }     
>>>>>>> d15c00f3b2ac68e916661eb8c7beea907cad1243
            });
        }
        else {
            console.log("User data already exists:" + req.body.mail);
            res.status(400).send({
                message: 'User data already exists:' + req.body.mail
            })
<<<<<<< HEAD
        }
=======
        }       
>>>>>>> d15c00f3b2ac68e916661eb8c7beea907cad1243

    });
})
router.put('/:id',(req,res) => {
    console.log('ID:', req.params.id)
    if(!ObjectId.isValid(req.params.id))
     return res.status(400).send('No record with given id: $(req.params.id)');

    // I'm not sure what happens down here in put function, but may need to hand data too
    // req.body.secret_key and req.body.iv should be decrypted with server private key
    // then the secret key and iv should be used to decrypte all person data fields
    // before re-encrypting and sending to the database

    // I'm not sure what happens down here in put function, but may need to hand data too
    // req.body.secret_key and req.body.iv should be decrypted with server private key
    // then the secret key and iv should be used to decrypte all person data fields
    // before re-encrypting and sending to the database

    var per = {
        $set: {
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            mail : req.body.mail,
            major : req.body.major,
            student_id : req.body.student_id,
            completion_year : req.body.completion_year,
            course_number : req.body.course_number,
            prev_username : req.body.prev_username,
        }
    };
    Person.findOneAndUpdate({ mail: req.body.mail }, per, { new: true, useFindAndModify: false }, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        } else if (doc) {
            res.status(200).send({
                auth: true,
                message: "1 document updated"
            })
        } else {
            res.status(404).send({
                message: "Resource not found, please register first with the email id!!"
            })
        }
        console.log(doc);
    });
})

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id: $(req.params.id)');

    Person.findByIdAndRemove(req.params.id, { new: true, useFindAndModify: false }, (err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log("Error in person updation" + JSON.stringify(err, undefined, 2)); }
    });
})

module.exports = router

// My Trial
// Second AES encryption before Database AES KEY 2
// Nodejs encryption with CTR 
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var encryptedText = new Array(2);
encryptedText[0] = 0, encryptedText[1] = 0

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    //return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    if (encryptedText[0] == 0) {
        encryptedText[0] = { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
    }
    else {
        encryptedText[1] = { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
    }
    const fs = require('fs')

    let data = JSON.stringify({ iv: iv.toString('hex'), key: key });
    fs.writeFile('AESKey.txt', data + os.EOL, (err) => {
        if (err) throw err;
    })
    return encrypted.toString('hex');
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

///  RSA Trial Publish Public KEY

var forge = require('node-forge');
var rsa = forge.pki.rsa;
var keypair = rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
fs.writeFileSync("public_key.txt", keypair.publicKey, "utf8");
fs.writeFileSync("private_key.txt", keypair.privateKey, "utf8");

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
    //  res.write(req.url);
    // res.write(JSON.stringify(keypair.publicKey));
    res.write(JSON.stringify({
        publicKeyPem: forge.pki.publicKeyToPem(keypair.publicKey),
    }));
    res.end();
}).listen(8080);

// David's Decrypt for AES KEY 1 

function decrypt_aes(ciphertext, iv, secret_key) {
    var decipher = forge.cipher.createDecipher('AES-CBC', secret_key);
    var encrypted = new forge.util.ByteStringBuffer().putBytes(ciphertext);
    decipher.start({iv: iv});
    decipher.update(encrypted);
    var finished = decipher.finish(); // check 'result' for true/false

    return decipher.output.data;
  }

  /*
const axios = require('axios');

axios.get('http://localhost:8080').then(resp => {

    console.log("GET working", resp.data);
}); */

// Nodemailer Code - Ajith testing

 //mail testing

 // define a sendmail endpoint, which will send emails and response with the corresponding status
 router.post("/sendmail", (req, res) => {
    console.log("request came");
    let user = req.body;
    sendMail(user, (err, info) => {
      if (err) {
        console.log(err);
        res.status(400);
        res.send({ error: "Failed to send email" });
      } else {
        console.log("Email has been sent");
        res.send(info);
      }
    });
  }); 
  
  
  
    var transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      secureConnection: false,
      port: 587,
      tls: {
        ciphers:'SSLv3'
     },
      auth: {
        user: "ajithchowdary_attanti@student.uml.edu",
        pass: "Uml@01825959"
      },
     // tls: {
       // ciphers:'SSLv3'
    //}
    }); 
  
  
  
  //transporter.sendMail(mailOptions, callback);
  
  //`"ajithchowdary_attanti@student.uml.edu"`,  
  