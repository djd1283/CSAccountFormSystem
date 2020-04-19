// Node.js program to demonstrate the  
// crypto.privateDecrypt() method 
  
// Including crypto and fs module 
const crypto = require('crypto'); 
const fs = require("fs"); 
const passphrase = "mySecret"  
// Using a function generateKeyFiles 
function generateKeyFiles() { 
  
    const keyPair = crypto.generateKeyPairSync('rsa', { 
        modulusLength: 530, 
        publicKeyEncoding: { 
            type: 'spki', 
            format: 'pem'
        }, 
        privateKeyEncoding: { 
        type: 'pkcs8', 
        format: 'pem', 
        cipher: 'aes-256-cbc', 
        passphrase: ''
        } 
    }); 
       
    // Creating public and private key file  
    fs.writeFileSync("public_key", keyPair.publicKey); 
    fs.writeFileSync("private_key", keyPair.privateKey); 
} 
  
// Generate keys 
// generateKeyFiles(); 

const publicKey = fs.readFileSync("../public_key", "utf8");

const privateKey = fs.readFileSync("../private_key", "utf8");
// console.log(privateKey)

const plaintext = Buffer.from('Hello world!', 'utf8');

// This is what you usually do to transmit encrypted data.
const enc1 = crypto.publicEncrypt(publicKey, plaintext);
console.log("Encrypted ", enc1.toString('base64'))
const dec1 = crypto.privateDecrypt(privateKey, enc1);
console.log(dec1.toString('utf8'));
