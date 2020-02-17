import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Observable } from 'rxjs';
import { faPencilAlt, faTrash, faChevronCircleUp, faChevronCircleDown, faEye} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
import { DialogService } from '../services/dialog.service';
import { Inventory } from '../model/inventory';
import { AuthService } from '../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';

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
              private dialogService: DialogService, public authService: AuthService
              ,private storage: AngularFireStorage
              ) { }

  ngOnInit() {
    this.inventoryService.doInventory();
    this.inventory = this.inventoryService.inventory; 
    this.getUrl()
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
    console.log('Deletimg ', inventory)
    this.dialogService.openDialog('Delete', inventory.shortName(), 'No', 'Yes').subscribe(
        deleteflg => {
          if (deleteflg) {
            this.inventoryService.deleteInventory(inventory.item_id).subscribe(val => console.log('update inventory', val), err => console.log('ERROR ', err))
          }
       }
    );
  }
  url$: Observable<string>;

  getUrl(){
   var storageRef = this.storage.ref('Inventory/AT.P.36.jpg');
   this.url$= storageRef.getDownloadURL();
  }

  clearSearch(){
    this.searchText='';
  }

  sort(direction:boolean, field:String){
    console.log('Sort ', field, direction);
    this.inventoryService.sortInventory(field, direction)
  }
}