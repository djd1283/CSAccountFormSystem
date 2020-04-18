var forge = require('node-forge');
var rsa = forge.pki.rsa;
var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
var bytes = "DavidisSmart"
var encrypted = keypair.publicKey.encrypt(bytes);
console.log("Encrypted", encrypted);

var decrypted = keypair.privateKey.decrypt(encrypted);
console.log("Decrypted", decrypted);