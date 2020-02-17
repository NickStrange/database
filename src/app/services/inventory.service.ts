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
                artwork.selected_file_placeholder,
                artwork.artist_name,
                artwork.title,
                artwork.series,
                artwork.type,
                artwork.date_year,
                artwork.medium,
                artwork.signatures_and_writing,
                artwork.condition,
                artwork.category,
                artwork.height,
                artwork.width,
                artwork.depth,
                artwork.size_notes,
                artwork.size_units,
                artwork.dimensions,
                artwork.selected_file_container,
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

  convert_from_json(raw_json):Inventory{
    return new Inventory(  
      raw_json["Item ID"],
      raw_json["Source"]||'',
      raw_json["Notes"]||'',
      raw_json["Location"]||'',
      raw_json["Value"]||'',
      raw_json["Inventory Date"]||'',
      raw_json["Selected File Placeholder"]||'',
      raw_json["Artist Name"]||'',
      raw_json["Title"]||'',
      raw_json["Series"]||'',
      raw_json["Type"]||'',
      raw_json["Date Year"]||'',
      raw_json["Medium"]||'',
      raw_json["Signatures And Writing"]||'',

      raw_json["Condition"]||'',
      raw_json["Category"]||'',

      raw_json["Size H in"]||'',
      raw_json["Size W in"]||'',
      raw_json["Size D in"]||'',
      raw_json["Size Note"]||'',
      raw_json["Size Units"]||'',
      raw_json["Dimensions"]||'',
      raw_json["Selected File Container"]||'',
      raw_json["File 1 Container"]||'',
      raw_json["File 2 Container"]||'',
      raw_json["File 3 Container"]||'',
      raw_json["File 4 Container"]||'',
      raw_json["File 5 Container"]||'' );
    }

    convert_to_json():any{
      let json_arr:  any[] = [];
      for (let row of this.inventory){
      json_arr.push({
        "Item ID": row.item_id,
        "Source":  row.source,
        "Notes":   row.notes,
        "Location": row.location,
        "Value": row.value,
        "Inventory Date": row.inventory_date,
        "Selected File Placeholder": row.selected_file_placeholder,
        "Artist Name": row.artist_name,
        "Title": row.title,
        "Series": row.series,
        "Type":row.type,
        "Date Year":row.date_year,
        "Medium":row.medium,
        "Signatures And Writing":row.signatures_and_writing,
  
        "Condition":row.condition,
        "Category": row.category,
  
        "Size H in":row.height,
        "Size W in":row.width,
        "Size D in":row.depth,
        "Size Note":row.size_notes,
        "Size Units":row.size_units,
        "Dimensions":row.dimensions,
        "Selected File Container":row.selected_file_container,
        "File 1 Container":row.file1,
        "File 2 Container":row.file2,
        "File 3 Container":row.file3,
        "File 4 Container":row.file4,
        "File 5 Container":row.file5});
      };
      return json_arr;
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
