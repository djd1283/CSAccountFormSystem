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
              prev_username: data.prev_username
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
    var secret_key = forge.random.getBytesSync(16);
    console.log(secret_key);

    var key_pair = this.personService.getPublicKey()

    var ct = key_pair.publicKey.encrypt(secret_key);

    var result = key_pair.privateKey.decrypt(ct);
    console.log(result);

    // var forge = require("node-forge");
    // generate a random key and IV
    // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
    var iv = forge.random.getBytesSync(16);
    
    /* alternatively, generate a password-based 16-byte key
    var salt = forge.random.getBytesSync(128);
    var key = forge.pkcs5.pbkdf2('password', salt, numIterations, 16);
    */
    var someBytes = "DavidSaiAjith";
    // encrypt some bytes using CBC mode
    // (other modes include: ECB, CFB, OFB, CTR, and GCM)
    // Note: CBC and ECB modes use PKCS#7 padding as default
    var cipher = forge.cipher.createCipher('AES-CBC', secret_key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(someBytes));
    cipher.finish();
    var encrypted = cipher.output;
    // outputs encrypted hex
    console.log(encrypted.data);
    
    // decrypt some bytes using CBC mode
    // (other modes include: CFB, OFB, CTR, and GCM)
    var decipher = forge.cipher.createDecipher('AES-CBC', secret_key);
    decipher.start({iv: iv});
    decipher.update(encrypted);
    var finished = decipher.finish(); // check 'result' for true/false
    // outputs decrypted hex
    console.log(decipher.output.data);

  }
  onSubmit(form : NgForm){

    var headlines = this.headline;
    if(headlines=='Computer Science Account Form') {
      this.personService.postPerson(form.value).subscribe((res) => {
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
    } else {

      var userData = {

        "_id": this._id,
        "major": this.major,
        "mail": this.mail,
        "first_name": this.first_name,
        "last_name": this.last_name,
        "student_id": this.student_id,
        "completion_year": this.completion_year,
        "course_number": this.course_number,
        "prev_username": this.prev_username,
      };
      this.personService.updatePerson(this._id, userData).subscribe((res) => {
        console.log(res);
        this.refreshPersonList();
      });
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