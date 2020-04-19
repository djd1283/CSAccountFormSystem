const express = require('express')
var router = express.Router()
var index = 0;
var os = require('os');
var results = []
const fs = require('fs')


var { Person } = require('../model/person.js')
var ObjectId = require('mongoose').Types.ObjectId

router.get('/', (req, res) => {
    Person.find((err, doc) => {
        if (!err) { res.send(doc) }
        else { console.log('Error in retrieving persons' + JSON.stringify(err, undefined, 2)); }
    })
})

router.post('/',(req,res) => {
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
    Person.findOne({'mail':req.body.mail}, (err, docs) => {
        console.log('Name, email:', per.first_name, per.mail)

        if (per.first_name != null) {per.first_name = encrypt(per.first_name);}
        if (per.last_name != null) {per.last_name = encrypt(per.last_name);}
        if (per.mail != null) {per.mail = encrypt(per.mail);}
        if (per.major != null) {per.major = encrypt(per.major);}
        if (per.student_id != null) {per.student_id = encrypt(per.student_id.toString('utf8'));}
        if (per.completion_year != null) {per.completion_year = encrypt(per.completion_year.toString('utf8'));}
        if (per.course_number != null) {per.course_number = encrypt(per.course_number.toString('utf8'));}
        if (per.prev_username != null) {per.prev_username = encrypt(per.prev_username);}
        //per.class = encrypt(per.class.toString());
    
        if (!docs) {
            per.save((err, doc) => {
                if(!err){                    
                    res.status(200).send({ auth: true, doc, message:"1 documents inserted!" });
                    if (per.first_name != null && per.last_name != null && per.mail != null) {
                        console.log("encrypted: ", doc.first_name, "decrypted: ", decrypt(encryptedText[0]));
                        // console.log("encrypted: ", doc.last_name, "decrypted: ", decrypt(per.last_name));
                        console.log("encrypted: ", doc.mail, "decrypted: ", decrypt(encryptedText[1]))
                        encryptedText[0] = 0, encryptedText[1] = 0
                    }
                    else {
                        console.log('Certain field values not available for encryption');
                    }
                }
                else {
                    console.log("User data already exists:" + req.body.mail);
                    res.status(400).send({
                        message: 'User data already exists:' + req.body.mail
                    })
                }            
            });
        }
        else { 
            console.log('Error in user inserting data' + JSON.stringify(err, undefined, 2)); 
        }

    });
})
router.put('/:id',(req,res) => {
    console.log('ID:', req.params.id)
    if(!ObjectId.isValid(req.params.id))
     return res.status(400).send('No record with given id: $(req.params.id)');

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
var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
fs.writeFileSync("public_key.txt", keypair.publicKey, "utf8");
fs.writeFileSync("private_key.txt", keypair.privateKey, "utf8");
// console.log(keypair.publicKey);
// var bytes = "DavidisSmart"
//var encrypted = keypair.publicKey.encrypt(bytes);
//console.log("Encrypted", encrypted);

//var decrypted = keypair.privateKey.decrypt(encrypted);
//console.log("Decrypted", decrypted);

//const publicKey = fs.readFileSync("./public_key", "utf8");

// const privateKey = fs.readFileSync("./private_key", "utf8");

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
    //  res.write(req.url);
    // res.write(JSON.stringify(keypair.publicKey));
    res.write(JSON.stringify({
        publicKeyPem: forge.pki.publicKeyToPem(keypair.publicKey),
        privateKeyPem: forge.pki.privateKeyToPem(keypair.privateKey)
    }));
    res.end();
}).listen(8080);

const axios = require('axios');

axios.get('http://localhost:8080').then(resp => {

    console.log("GET working", resp.data);
});