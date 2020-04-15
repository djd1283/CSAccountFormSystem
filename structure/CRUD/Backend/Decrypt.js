// Decrypt file for demo
const mongoose = require('mongoose')
const fs = require('fs')
var key, iv, text, keyObj;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var os = require('os');

mongoose.connect('mongodb://localhost:27017/firstdb', { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
  if (!err) {
    db.collection("people").find({}).toArray(function (err, result) {
      if (err) throw err;
      // console.log(result);

      let data = JSON.stringify(result);
      var dataObj = JSON.parse(data);
      // console.log(dataObj[0].name);

      decryption(dataObj);

      fs.writeFile('MongoData.txt', data, (err) => {
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
  var nameEnc, name, mailEnc, mail;
  fs.readFile('AESKey.txt', 'utf8', function (err, keyring) {
    if (err) throw err;
    keyObj = JSON.parse(keyring);
    key = keyObj.key, iv = keyObj.iv;
    //   console.log(keyObj.key);

    for (var i = 0; i < encrypted.length; ++i) {
      nameEnc = { iv: iv, encryptedData: encrypted[i].name }
      name = decrypt(nameEnc);
      mailEnc = { iv: iv, encryptedData: encrypted[i].mail }
      mail = decrypt(mailEnc);
      let data = { ID: encrypted[i]._id, Name: name, Mail: mail };
      console.log(data);
      fs.appendFile('DecryptedData.txt', JSON.stringify(data)+os.EOL, (err) => {
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