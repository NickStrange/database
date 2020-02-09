import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../model/contact';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog} from '@angular/material';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {

  contact: Contact;
  id : number;
  isInsert: boolean;
  label: string;

  constructor(public dataService: ContactService, private router:Router, 
    private route:ActivatedRoute, private dialog: MatDialog,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isInsert = this.id == undefined;
    console.log('PASSED insert', this.isInsert);
    if (this.isInsert) {
      this.label = 'Create';
      this.contact = new Contact(this.dataService.nextId(), "", "", "", "", "", "", "", "", "", "", "");
      console.log('create new empty contact ', this.contact);
    }
    else {
      this.label = 'Update';
      this.contact = this.dataService.getContact(this.id);
      console.log('in update', this.contact);
    }
  }

  createContact(){
    if (this.isInsert){
      this.dataService.createContact(this.contact)
          .subscribe(val => console.log('create contact', val), 
              err => this.dialogService.openDialog('Error', err, 'close', ''))}
    else {
      this.dataService.updateContact(this.contact)
          .subscribe(val => console.log('update contact', val), 
              err => this.dialogService.openDialog("Error", err, 'close',''))}
    this.router.navigateByUrl('/contact-list');
  }

  cancel(){
    this.router.navigateByUrl('/contact-list');
  }
}
