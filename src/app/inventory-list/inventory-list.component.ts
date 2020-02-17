import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Observable } from 'rxjs';
import { faPencilAlt, faTrash, faChevronCircleUp, faChevronCircleDown, faEye} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogService } from '../services/dialog.service';
import { Inventory } from '../model/inventory';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  faPencil = faPencilAlt;
  faTrash = faTrash;
  faChevronUp = faChevronCircleUp;
  faChevronDown = faChevronCircleDown;
  faeyeicon = faEye;
  searchText : String='';

  inventory: Inventory[];
  selectedInventory: Inventory;

  constructor(public inventoryService: InventoryService, private router:Router,
              private dialogService: DialogService, public authService: AuthService) { }

  ngOnInit() {
    this.inventoryService.doInventory();
    this.inventory = this.inventoryService.inventory; 
  }

  public showInventory(inventory: Inventory){
    console.log('show inventory ', inventory);
    this.router.navigateByUrl(`inventory-create/${inventory.item_id}/true`);
    this.selectedInventory = inventory;
  }

  public updateInventory(inventory: Inventory){
    console.log('update inventory ', inventory);
    this.router.navigateByUrl(`inventory-create/${inventory.item_id}/false`);
    this.selectedInventory = inventory;
  }

  public deleteInventory(inventory: Inventory){
    this.dialogService.openDialog('Delete', inventory.shortName(), 'No', 'Yes').subscribe(
        deleteflg => {
          if (deleteflg) {
            this.inventoryService.deleteInventory(inventory.item_id).subscribe(val => console.log('update inventory', val), err => console.log('ERROR ', err))
          }
       }
    );
  }

  clearSearch(){
    this.searchText='';
  }

  sort(direction:boolean, field:String){
    console.log('Sort ', field, direction);
    this.inventoryService.sortInventory(field, direction)
  }
}