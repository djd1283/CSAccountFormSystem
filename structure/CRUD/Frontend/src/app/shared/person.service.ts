import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Person } from './person.model';
import { NgForm } from '@angular/forms';

import * as forge from 'node-forge';

@Injectable()
export class PersonService {
  selectedPerson = Person;
  persons : Person[];
  readonly baseURL ="http://localhost:3000/person";
  readonly keyURL = "http://localhost:8080/";

  constructor( private http : HttpClient) { }

  updatePerson(_id:string, person : Person) {
    return this.http.put(this.baseURL + `/${_id}`, person);
  }
  
  postPerson(person : Person) {
    return this.http.post(this.baseURL,person)
  }

  getPersonList(){
    return this.http.get(this.baseURL);
  }

  getPublicKey() {
    var rsa = forge.pki.rsa;
    var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    //return this.http.get(this.keyURL)
    return keypair;
  }
  
  deletePerson(_id:string){
    return this.http.delete(this.baseURL + `/${_id}`)
  }
}