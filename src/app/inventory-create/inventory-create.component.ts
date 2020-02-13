import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Inventory } from '../model/inventory';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog} from '@angular/material';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-contact-create',
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent implements OnInit {

  inventory: Inventory;
  item_id : string;
  isInsert: boolean;
  label: string;

  constructor(public dataService: InventoryService, private router:Router, 
    private route:ActivatedRoute, private dialog: MatDialog,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.item_id = this.route.snapshot.params['item_id'];
    this.isInsert = this.item_id == undefined;
    console.log('PASSED insert', this.isInsert);
    if (this.isInsert) {
      this.label = 'Create';
      this.inventory = new Inventory("", 
              "", "", "", "", "", "", "", "", "", "",
              "", "", "", "", "", "", "", "", "", "",
              "", "", "", "", "", "");
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
