import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { PersonService } from '../shared/person.service';
import { Person } from '../shared/person.model';

import * as forge from 'node-forge';
// import * as CryptoJS from 'crypto-js';
import * as $ from 'jquery';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers : [PersonService]
})

export class FormComponent implements OnInit {
  tableHeading: any;
  tableData: any;
  headline: any;
  _id: any;
  mail: any;
  major: any;
  first_name: any;
  last_name: any;
  student_id: any;
  completion_year: any;
  course_number: any;
  prev_username: any;
  honeypot:any;
  
  

	
  disableStatus: any;
  public data = [];  
  result: any;
  public displayedColumns: Array<any> = [];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public stickyColumns: string[] = ['topics', 'country'];
  arrayOne(n: number): any[] {
    return Array(n);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  public fieldNames: Array<any> = [];
  constructor(private personService : PersonService) { 
    this.disableStatus = false;
    this.headline = 'Computer Science Account Form';  
  }

  ngOnInit() {
    this.fieldNames = [];
    this.fieldNames = ['_id','major','email', 'first_name', 'last_name', 'student_id', 
                       'completion_year', 'course_number', 'prev_username'];
    this.displayedColumns.push('edit');
    this.displayedColumns.push('delete');
    this.displayedColumns = this.displayedColumns.concat(this.fieldNames);  


    this.personService.getPersonList().subscribe(async(data) => {
        this.result = await data;
        this.result.forEach(data => {
            this.data.push({
              _id: data._id,
              major: data.major,
              email: data.mail,
              first_name: data.first_name,
              last_name: data.last_name,
              student_id: data.student_id,
              completion_year: data.completion_year,
              course_number: data.course_number,
              prev_username: data.prev_username,
			
            });
        })
        this.dataSource.data = await this.data;
        this.dataSource.paginator = await this.paginator;      
      },
      error => {
        console.log("Error", error);
        var value = (<HTMLInputElement>document.getElementById("Nodatafound"));
        value.style.display = 'block';
      }
    );
    this.refreshPersonList();

    // here we try out encryption code
    // we grab public key from the server
    // const public_key = '0123445679abcdef0123456789abcdef'
    // we generate secret key
    
    // we send secret key to the server
    // we encrypt using secret key
    
    // var pkstr = '-----BEGIN PUBLIC KEY-----' + public_key + '-----END PUBLIC KEY-----';
    // const pk = forge.pki.publicKeyFromPem(pkstr);
    // const encrypted_secret = forge.util.encode64(pk.encrypt(forge.util.hexToBytes(secret_key)));

    //  var pkstr = '-----BEGIN PUBLIC KEY-----' + public_key + '-----END PUBLIC KEY-----';
    // const pk = forge.pki.publicKeyFromPem(pkstr);

    //const secret_key = '0123445679abcdef0123456789abcdef';


    // var public_key_json = JSON.parse(public_key_str);
    // var publicKey = forge.pki.publicKeyFromPem(public_key_json);

    // var rsa = forge.pki.rsa;
    // var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    //return this.http.get(this.keyURL)

    //console.log('key pair:', key_pair);

    // var forge = require("node-forge");
    // generate a random key and IV
    // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
 
    // outputs decrypted hex
    //console.log(decipher.output.data);

  }

  encryptFormAndSend(form : any) {
    // this is a function created to encrypt the webform with AES before sending! uses RSA and AES

    console.log('Encrypting webform now');
      
    // create a secret key and init vector we will use for AES
    var secret_key = forge.random.getBytesSync(16);
    var iv = forge.random.getBytesSync(16);
    console.log('secret key:', secret_key);
    
    // retrieve the server public key
    var observable = this.personService.getPublicKey()
    var public_key_str = null;
    observable.subscribe(data => {
      public_key_str = data;
      // console.log(data);
      var foo = public_key_str  // JSON.parse(public_key_str);
      // this is the public key from the server
      var publicKey = forge.pki.publicKeyFromPem(foo.publicKeyPem) as forge.pki.rsa.PublicKey;

      // var result = privateKey.decrypt(encrypted_secret);
      // console.log('decrypted secret key:', result);
      
      // we test out an example of encryption and decryption using this iv and secret key
      var someBytes = "DavidSaiAjith";
      // encrypt some bytes using CBC mode
      // (other modes include: ECB, CFB, OFB, CTR, and GCM)
      // Note: CBC and ECB modes use PKCS#7 padding as default
      function encrypt_aes(plaintext, iv, secret_key) {
        var cipher = forge.cipher.createCipher('AES-CBC', secret_key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(plaintext));
        cipher.finish();
        var encrypted = cipher.output;
        console.log('here');
        return encrypted.getBytes();
      }
      // outputs encrypted hex
      //console.log(encrypted.data);

      // decrypt some bytes using CBC mode
      // (other modes include: CFB, OFB, CTR, and GCM)
      function decrypt_aes(ciphertext, iv, secret_key) {
        var decipher = forge.cipher.createDecipher('AES-CBC', secret_key);
        var encrypted = new forge.util.ByteStringBuffer().putBytes(ciphertext);
        decipher.start({iv: iv});
        decipher.update(encrypted);
        var finished = decipher.finish(); // check 'result' for true/false

        return decipher.output.data;
      }
      
      // print out encrypted and decrypted sample bytes
      var encrypted_id = encrypt_aes(someBytes, iv, secret_key);
      console.log('here too');
      console.log('id:', someBytes);
      console.log('encrypt id:', encrypted_id);
      var decrypted_id = decrypt_aes(encrypted_id, iv, secret_key);
      console.log('decrypt id:', decrypted_id);

      // HERE IS WHERE WE ENCRYPT THE DATA IN form.value USING THE SECRET KEY WITH AES

      var encrypted_form = {

        "_id": form._id,
        "major":  encrypt_aes(form.major, iv, secret_key),
        "mail":  encrypt_aes(form.mail, iv, secret_key),
        "first_name": encrypt_aes(form.first_name, iv, secret_key),
        "last_name":  encrypt_aes(form.last_name, iv, secret_key),
        "student_id":  encrypt_aes(form.student_id, iv, secret_key),
        "completion_year":  encrypt_aes(form.completion_year, iv, secret_key),
        "course_number":  encrypt_aes(form.course_number, iv, secret_key),
        "prev_username":  encrypt_aes(form.prev_username, iv, secret_key),
        "secret_key":  publicKey.encrypt(secret_key), // we send secret key and iv using PKC
        "iv":  publicKey.encrypt(iv),
      };
		  if (form.honeypot != null) {
        window.alert("Bot identified");
      }
	    else {
        this.personService.postPerson(encrypted_form).subscribe((res) => {
          this.refreshPersonList();
        },
        err => {
            console.log(err);
            (<HTMLInputElement>document.getElementById("errmsg1")).innerHTML = err.error.message;
            var value = (<HTMLInputElement>document.getElementById("errmsg1"));
            value.style.display = 'block';
            value.style.color = 'red';
            // successmessage.style.display = 'none';
          }
        );
	    }
      // so here I need to encrypt the webform AND send it
      // I need to figure out how to get each encrypted value to be a string
      // send encrypted secret key and iv with form data
    });
  }

  onSubmit(form : NgForm){
    console.log('submit');

    var headlines = this.headline;
    if(headlines=='Computer Science Account Form') {

      this.encryptFormAndSend(form.value);

    } else {

      console.log('Updating person code we do not use');

      // var userData = {

      //   "_id": this._id,
      //   "major": this.major,
      //   "mail": this.mail,
      //   "first_name": this.first_name,
      //   "last_name": this.last_name,
      //   "student_id": this.student_id,
      //   "completion_year": this.completion_year,
      //   "course_number": this.course_number,
      //   "prev_username": this.prev_username,
      // };
      // this.personService.updatePerson(this._id, userData).subscribe((res) => {
      //   console.log(res);
      //   this.refreshPersonList();
      // });
    } 
    // window.location.reload();
  }
  isSticky(column: string) {
    return this.stickyColumns.find(val => val === column) !== undefined
      ? true
      : false;
  }
  refreshPersonList(){ 
    this.personService.getPersonList().subscribe((res) => {
      this.personService.persons = res as Person[];
    })
  }

  onDelete(element){
     var result = confirm("Are you sure want to delete it ?"); 
        if (result == true) { 
          this.personService.deletePerson(element._id).subscribe((res) => {
               this.refreshPersonList();
               //this.data.toast({html:'Deleted Successfully',classes : 'rounded' });
            })
        } else { 
          alert('Item not deleted!');
      }   
    window.location.reload();
  }
  editView(element) {
    this._id = element._id;
    this.mail = element.email;
    this.major = element.class;
    this.first_name = element.first_name;
    this.last_name = element.last_name;
    this.student_id = element.student_id;
    this.prev_username = element.prev_username;
    this.completion_year = element.completion_year;
    this.course_number = element.course_number;
   
    // $("label[for='name']").toggleClass('active');
    // $("label[for='email']").toggleClass('active');
    $("label[for='email']").css('display', 'none');
    $("label[for='first_name']").css('display', 'none');
    $("label[for='last_name']").css('display', 'none');
    $("label[for='student_id']").css('display', 'none');
    $("label[for='prev_username']").css('display', 'none');
    $("label[for='completion_year']").css('display', 'none');
    $("label[for='course_number']").css('display', 'none');
    this.headline = 'Update';  
    this.disableStatus = true;

    // this.personService.getPersonList().subscribe((res) => {
    //   this.personService.persons = res as Person[];
     
    // })
   

  }
}