import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contacts } from './contacts';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ ContactsService ]
})

export class ContactsComponent implements OnInit {

  contacts: Contacts[];
  first_name: String;
  last_name: String;
  phone: String;

  constructor(private _contactsService: ContactsService) { }

  addContact(){
    let newContact = {
      first_name : this.first_name,
      last_name : this.last_name,
      phone : this.phone
    }
    
    this.first_name = '';
    this.last_name = '';
    this.phone = '';

    this._contactsService.addContact(newContact)
      .subscribe( contact => { //add the contact if successfully added into DB
          this.contacts.push(contact);
          this._contactsService.getContacts()
          .subscribe( contacts => this.contacts = contacts);
      });
        
  }

  deleteContact(id){
    this._contactsService.deleteContact(id)
      .subscribe( data => { //deleting the contact from local variable, so update would be instant
        if(data.n==1){
          for(let i=0; i<this.contacts.length;i++){
            if(this.contacts[i]._id == id){
              this.contacts.splice(i, 1);
              break;
            }
          }
        }
      });
  }

  ngOnInit() {
    this._contactsService.getContacts()
      .subscribe( contacts => this.contacts = contacts);
  }

}
