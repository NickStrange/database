import { Injectable, OnInit } from '@angular/core';
import { Inventory} from '../model/inventory';
import { Observable, Subscriber, from, onErrorResumeNext } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InventoryService{

  inventory: Inventory[] = [];

  inventory$: Observable<Inventory[]>;
  observer;
  
  constructor(private db: AngularFirestore) { }


  doInventory(){
    this.inventory$ = new Observable((observer) => 
        this.loadContacts().subscribe(val => {this.inventory = val; observer.next(this.inventory)})
    )
  }



  loadContacts(): Observable <Inventory[]>{
    return this.db.collection('inventory').snapshotChanges()  
        .pipe(map(snaps => {
            return snaps.map(snap=>{
              let artwork = snap.payload.doc.data() as Inventory

              return new Inventory(
                artwork.item_id,
                artwork.source,
                artwork.notes,
                artwork.location,
                artwork.value,
                artwork.inventory_date,
                artwork.selected_file,
                artwork.artist_name,
                artwork.title,
                artwork.series,
                artwork.type,
                artwork.date_year,
                artwork.medium,
                artwork.signatures_and_writing,
                artwork.condition,
                artwork.height,
                artwork.width,
                artwork.depth,
                artwork.size_notes,
                artwork.size_units,
                artwork.dimensions,
                artwork.selected_file,
                artwork.file1,
                artwork.file2,
                artwork.file3,
                artwork.file4,
                artwork.file5
                );        
      });
     }
    ));
  }
  
  
  public createInventory(inventory: Inventory) : Observable <any>{
    this.inventory.push(inventory);
    return from(this.db.doc(`inventory/${inventory.item_id}`).set({
      ...inventory
    }));
  }
  
  public updateInventory(inventory: Inventory) : Observable <any>{
    console.log('updating ', inventory.item_id)
    return from(this.db.doc(`inventory/${inventory.item_id}`).update({
      ...inventory
    }));
  }

  public deleteInventory(id: string): Observable <any>{ 
    const contact = this.inventory.filter(artwork => artwork.item_id == id)[0]
    console.log('DELETE ', id);
    return from(this.db.doc(`inventory/${id}`).delete());
  }

  public getInventory(id: string) :Inventory{
      const inventory = this.inventory.filter(inventory => inventory.item_id== id)[0]
      console.log('found ' , inventory , ' for ', id);
      return inventory;
    }

  nextId():number{
    return 1000;
  }


    //  sort artworks up or down
    sortInventory(field, down) {
       let direction = down ? 1 : -1;
       console.log('SORT ', field, down, direction, -direction);
   //sort array
         this.inventory = this.inventory.sort(function(a, b) {
       // both null - sort by contactId or if both the same
       if (a[field] === "" && b[field] === "")
           return (a.item_id < b.item_id)? direction: -direction;
       if (a[field] == b[field]) return (a.item_id < b.item_id)? direction: -direction;
       if (a[field] === "") return 1;
       if (b[field] === "") return -1;
       if (a[field].toLowerCase() < b[field].toLowerCase()){
         return -1 * direction;
       }
       if (a[field].toLowerCase() > b[field].toLowerCase()) {
         return 1 * direction;
       }
       return 0;
     });
  }
}
