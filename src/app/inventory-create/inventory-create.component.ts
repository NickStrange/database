import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Inventory } from '../model/inventory';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../services/dialog.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inventory-create',
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent implements OnInit {

  inventory: Inventory;
  item_id : string;
  isInsert: boolean;
  label: string;
  display_only: boolean;

  constructor(public dataService: InventoryService, private router:Router, 
    private route:ActivatedRoute, private dialog: MatDialog,
    private dialogService: DialogService, public authService: AuthService) { }

   // dropdown_keys = ['Album', 'Box', 'Drawing', 'ElectroMedia', 'NoteBook', 'Painting', 'Photography', 'Poetry Poster']
    drop_downs= new Map([
      ['Album', 'A'],
      ['Box', 'B'],
      ['Drawing', 'D'],
      ['ElectroMedia', 'E'],
      ['NoteBook', 'N'],
      ['Painting', 'P'],
      ['Photography', 'PH'],
      ['Poetry Poster', 'PP']]
    )

  set_option(value:string){
    const shortName = this.drop_downs.get(value) 
    const id = this.dataService.convertId(shortName) + 1;
    const item_id ='AT.' + shortName + '.' + id.toString().padStart(4, '0');
    this.inventory.item_id = item_id;
    this.inventory.category = value;
    console.log('set item_id', item_id);   
  }

  choose_option(e){
    this.set_option(e.target.value)
  }

    getKeys(){
      return Array.from(this.drop_downs.keys());
    }
    chosen_option: string;

  ngOnInit() {
    this.item_id = this.route.snapshot.params['item_id'];
    this.display_only = this.route.snapshot.params['display']=="true";
    console.log('DISPLAY ', "*"+this.route.snapshot.params['display']+"*",this.display_only);
    this.isInsert = this.item_id == undefined;
    console.log('PASSED insert', this.isInsert);
    if (this.isInsert) {
      this.label = 'Create';
      this.inventory = new Inventory('','','');
      this.set_option('Painting')
      console.log('create new empty contact ', this.inventory);
    }
    else {
      this.label = 'Update';
      this.inventory = this.dataService.getInventory(this.item_id);
      console.log('in update', this.inventory);
    }
  }

  createContact(){
    if (this.isInsert){
      console.log('INSERTING', this.inventory);
      this.dataService.createInventory(this.inventory)
          .subscribe(val => console.log('create contact', val), 
              err => this.dialogService.openDialog('Error', err, 'close', ''))}
    else {
      this.dataService.updateInventory(this.inventory)
          .subscribe(val => console.log('update contact', val), 
              err => this.dialogService.openDialog("Error", err, 'close',''))}
    this.router.navigateByUrl('/inventory-list');
  }

  cancel(){
    this.router.navigateByUrl('/inventory-list');
  }
}
