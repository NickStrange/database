import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../model/contact';
import { Observable } from 'rxjs';
import { faPencilAlt, faTrash, faChevronCircleUp, faChevronCircleDown} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PrintLabelComponent } from '../print-label-component';
import { DialogService } from '../services/dialog.service';


pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  faPencil = faPencilAlt;
  faTrash = faTrash;
  faChevronUp = faChevronCircleUp;
  faChevronDown = faChevronCircleDown;
  searchText : String='';

  contacts: Contact[];
  selectedContact: Contact;

  constructor(public contactService: ContactService, private router:Router,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.contactService.doContacts();
    this.contacts = this.contactService.contacts; 
  }

  public selectContact(contact: Contact){
    this.router.navigateByUrl(`contact-create/${contact.id}`);
    this.selectedContact = contact;
  }

  public deleteContact(contact: Contact){
    this.dialogService.openDialog('Delete', contact.shortName(), 'No', 'Yes').subscribe(
        deleteflg => {
          if (deleteflg) {
            this.contactService.deleteContact(contact.id).subscribe(val => console.log('update contact', val), err => console.log('ERROR ', err))
          }
       }
    );
  }

  generatePdf() {
    let printLabel = new PrintLabelComponent(this.contactService.labelgenerator());
    printLabel.generatePdf();
  }

  clearSearch(){
    this.searchText='';
  }

  sort(direction:boolean, field:String){
    console.log('Sort ', field, direction);
    this.contactService.sortContacts(field, direction)
  }
}

