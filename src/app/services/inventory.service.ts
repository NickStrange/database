import { Injectable, OnInit } from '@angular/core';
import { Inventory} from '../model/inventory';
import { Observable, Subscriber, from, onErrorResumeNext } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map} from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InventoryService implements OnInit{

  inventory: Inventory[] = [];


  observer;
  count = 0;
  
  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  ngOnInit() {

  }


  doInventory(){
    this.db.collection('inventory').snapshotChanges()  
        .pipe(map(snaps => {
            return snaps.map(snap=>{
              const data = snap.payload.doc.data();
              const inventory_item: Inventory = Inventory.makeInventory(data);
              console.log('done', inventory_item.toString());
              this.inventory.push(inventory_item);
      });
     }
    )).subscribe();
  }
  
  
  public createInventory(inventory_item) : Observable <any>{
    this.inventory.push(inventory_item);
    return from(this.db.doc(`inventory/${inventory_item.item_id}`).set({
      ...inventory_item
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
