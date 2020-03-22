import { Injectable, NgZone } from '@angular/core';
import { Inventory} from '../model/inventory';
import { Observable, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map} from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class InventoryService  {

  inventory: Inventory[] = [];

  count = 0;
  
  constructor(private db: AngularFirestore, private storage: AngularFireStorage,
    private router:Router, private ngZone: NgZone,) { }


  clear_inventory(){
    this.inventory= []
  }

  remove_id(id){
    for (let i =0; i < this.inventory.length ; i++){
      if (this.inventory[i].item_id == id){
          this.inventory.splice(i, 1)
          console.log('deleted', id)
          break;
      }
    }
  }

  doInventory(){
        let count=0;
        this.db.collection('inventory').stateChanges()
        .pipe(map(snaps => {
            return snaps.map(snap=>{ 
              const type = snap.type;
              const data = snap.payload.doc.data();
              const inventory_item: Inventory = Inventory.makeInventory(data);
              if (type  != 'added'){
                this.remove_id(inventory_item.item_id);
                console.log('remove', type);
              }
              else {
                count+=1;
              }
              this.inventory.push(inventory_item);
      });
     }
    )).subscribe( x => this.ngZone.run(() => this.router.navigateByUrl('/inventory-list')));
  }

  getUrl(file_name){
        const storageRef = this.storage.ref(`inventory/${file_name}`);
        const url = storageRef.getDownloadURL();
        return url;
   }

  
  public createInventory(inventory_item) : Observable <any>{
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
       console.log('TYPE', typeof(a[field]))
       let fielda = a[field];
       let fieldb = b[field];
       if (typeof(a[field])=='string'){
         fielda = fielda.toLowerCase();
         fieldb = fieldb.toLowerCase();
       }
       if (!a[field]  && !b[field])
           return (a.item_id < b.item_id)? direction: -direction;
       if (a[field] == b[field]) return (a.item_id < b.item_id)? direction: -direction;
       if (!a[field]) return 1;
       if (!b[field]) return -1;
       if (fielda < fieldb){
         return -1 * direction;
       }
       if (fielda > fieldb) {
         return 1 * direction;
       }
       return 0;
     });
  }
}
