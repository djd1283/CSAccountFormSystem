import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { PersonService } from '../shared/person.service'
import { Person } from '../shared/person.model'
import * as $ from 'jquery';
// import { Router } from '@angular/router';

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
    window.location.reload();
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