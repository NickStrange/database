import { Injectable, OnInit } from '@angular/core';
import { Contact } from '../model/contact';
import { Observable, Subscriber, from, onErrorResumeNext } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map} from 'rxjs/operators';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';




@Injectable({
  providedIn: 'root'
})
export class ContactService{

  contacts: Contact[] = [
   // new Contact(1, "Mr", "Nick", "Strange", "617 392 0970", "nsstrange@icloud.com", "Fidelity", "348 Nahant Rd", "Mahant", "US","Ma", "01907"),
   // new Contact(1, "Ms", "Wendy", "Payne", "617 392 0970", "nsstrange@icloud.com", "Fidelity", "348 Nahant Rd", "Mahant", "US","Ma", "01907")
  ];

  contacts$: Observable<Contact[]>;
  observer;


  
  constructor(private db: AngularFirestore) { }


  doContacts(){
    this.contacts$ = new Observable((observer) => 
        this.loadContacts().subscribe(val => {this.contacts = val; observer.next(this.contacts)})
    )
  }


  loadContacts(): Observable <Contact[]>{
    return this.db.collection('contacts').snapshotChanges()  
        .pipe(map(snaps => {
            return snaps.map(snap=>{
              let contact = snap.payload.doc.data() as Contact
              //return <Contact> {
              //    id: snap.payload.doc.id,
              //    ...contact
              //    };
              return new Contact(
                parseInt(snap.payload.doc.id), 
                contact.title,
                contact.first_name, 
                contact.last_name, 
                contact.phone, 
                contact.email,
                contact.company,
                contact.address,
                contact.city,
                contact.country,
                contact.state,
                contact.post_code);        
      });
     }
    ));
  }
  
  
  public createContact(contact: Contact) : Observable <any>{
    console.log('creating ', contact.id)
    this.contacts.push(contact);
    return from(this.db.doc(`contacts/${contact.id}`).set({
      ...contact
    }));
  }
  
  public updateContact(contact: Contact) : Observable <any>{
    console.log('updating ', contact.id)
    return from(this.db.doc(`contacts/${contact.id}`).update({
      ...contact
    }));
  }

  public deleteContact(id: Number): Observable <any>{ 
    const contact = this.contacts.filter(contact => contact.id == id)[0]
    console.log('DELETE ', id);
    return from(this.db.doc(`contacts/${id}`).delete());
  }

  public getContact(id: number) :Contact{
      const contact = this.contacts.filter(contact => contact.id == id)[0]
      console.log('found ' , contact , ' for ', id);
      return contact;
    }

  *labelgenerator(){
    for (let contact of this.contacts) {
      if (contact.is_valid_address()){
        let res = []
        res.push(contact.title + ' ' + contact.first_name + ' ' + contact.last_name);
        res.push(contact.address);
        res.push(contact.city);
        res.push(contact.state+ ' ' + contact.post_code);
        res.push(contact.country)
        yield(res);
      }
    }
  }

  nextId():number{
    let next = 0
    for (let contact of this.contacts){
      if (contact.id > next) {
        next = contact.id;
      }  
    } 
    return next + 1;
  }


    //  sort cotacts up or down
    sortContacts(field, down) {
      let direction = down ? 1 : -1;
      let contactArr = [];
  //sort array
      if (field !== "id") {
        this.contacts = this.contacts.sort(function(a, b) {
      // both null - sort by contactId or if both the same
         if (a[field] === "" && b[field] === "")
            return (b.id - a.id) * direction;
      if (a[field] == b[field]) return (b.id - a.id) * direction;
      if (a[field] === "") return 1;
      if (b[field] === "") return -1;
      if (a[field].toLowerCase() < b[field].toLowerCase())
        return -1 * direction;
      if (a[field].toLowerCase() > b[field].toLowerCase()) return 1 * direction;
      return 0;
    });
  } else {
    this.contacts = this.contacts.sort(function(a, b) {
      return (b.id - a.id) * direction;
    });
  }
}


}
