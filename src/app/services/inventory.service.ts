import { Injectable, NgZone } from '@angular/core';
import { Inventory} from '../model/inventory';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map} from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class InventoryService  {

  public inventory: Inventory[] = [];
  private _inventory_bh = new BehaviorSubject<Inventory[]>([])
  inventory$  = this._inventory_bh.asObservable();
  max_values = new Map();

  count = 0;
  
  constructor(private db: AngularFirestore, private storage: AngularFireStorage,
    private router:Router, private ngZone: NgZone,) { }


  clear_inventory(){
    this.inventory= [];
    this.max_values = new Map();
  }

  remove_id(id){
    this.inventory = this.inventory.filter(value =>  value.item_id != id);
    this._inventory_bh.next(Object.assign([], this.inventory));
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
              }
              else {
                count+=1;
              console.log(count, inventory_item)
              this.check_max_values(inventory_item);
            //  if (inventory_item.item_id.includes('AT.B')) {
                  this.inventory.push(inventory_item);
            //  }
            }
      });
     }
    )).subscribe( x => 
      { 
        this._inventory_bh.next(Object.assign([], this.inventory))
        this.ngZone.run(() => this.router.navigateByUrl('/inventory-list'))});
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

  convertId(from:string):number{
    return this.max_values.get(from);
  }

  nextId():number{
    console.log(this.max_values);
    return 1000;
  }

  check_max_values(inventory_item: Inventory){
    const res = inventory_item.item_id.split('.');
    const intval = parseInt(res[2]);
    if (!this.max_values.get(res[0])){
      this.max_values.set(res[1], intval);
      console.log(this.max_values)
    } 
    else {
      if (intval> this.max_values.get(res[1])) {
        this.max_values.set(res[1], intval);
      }
    }
  }

    //  sort artworks up or down
    sortInventory(field, down, searchText) {
       let direction = down ? 1 : -1;
       console.log('SORT ', field, down, direction, -direction);
   //sort array
       let text_to_sort = this.inventory;
       if (searchText){
         text_to_sort = this.search(searchText);
       }
         let sorted_inventory = text_to_sort.sort(function(a, b) {
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
     this._inventory_bh.next(Object.assign([], sorted_inventory));
  }

  clearSearch(){
    this._inventory_bh.next(Object.assign([], this.inventory));
  }

  search(text){
    console.log('SEARCH FOR ', text)
    if (text){
      console.log('SEARCHING FOR ', text)
      let searched_array = this.inventory.filter(item => item.toString().toUpperCase().includes(text.toUpperCase()))
      this._inventory_bh.next(searched_array);
      return searched_array;
    }

  }
}
