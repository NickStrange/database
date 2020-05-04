import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { faPencilAlt, faTrash, faChevronCircleUp, faChevronCircleDown, faEye} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
import { DialogService } from '../services/dialog.service';
import { Inventory } from '../model/inventory';
import { AuthService } from '../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { R3TargetBinder } from '@angular/compiler';

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
  searchText : string='';

  selectedInventory: Inventory;

  constructor(public inventoryService: InventoryService, private router:Router,
              private dialogService: DialogService, public authService: AuthService
              ,private storage: AngularFireStorage, private ngZone: NgZone
              ) { }

  ngOnInit() {
  }

  get_color(row_index):string{
    if (row_index %2  == 0){
      return 'rgb(240, 250,  250)';
    }
    else {
      return 'rgb(250, 236, 250)';
    }
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
            console.log('Deleting ', inventory.item_id)
            this.inventoryService.deleteInventory(inventory.item_id);
            this.searchText='';
          }
       }
    );
  }

  clearSearch(){
    this.searchText='';
    this.inventoryService.clearSearch();
  }
  
  startSearch(){
    this.inventoryService.search(this.searchText);
  }

  sort(direction:boolean, field:String){
    console.log('Sort ', field, direction, 'search text', this.searchText);
    this.inventoryService.sortInventory(field, direction, this.searchText);
    this.ngZone.run(() => this.router.navigateByUrl('/inventory-list'));
  }
}