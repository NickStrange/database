import { Component, ViewChild } from "@angular/core";
import { InventoryListComponent } from "../inventory-list/inventory-list.component";
import { InventoryService } from "../services/inventory.service";
import { AngularCsv } from "angular7-csv";
import { formatDate } from "@angular/common";
import { DialogService } from "../services/dialog.service";
import { trimTrailingNulls } from "@angular/compiler/src/render3/view/util";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { Inventory } from "../model/inventory";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

@Component({
  selector: "app-filest",
  templateUrl: "./files.component.html",
  styleUrls: ["./files.component.css"]
})
export class FilesComponent {
  constructor(
    private inventoryService: InventoryService,
    private dialogService: DialogService,
    private authService: AuthService
  ) {}
  fileName = "Inventory";
  isAdmin$: Observable<boolean>;

  fileUploaded: File;
  title = "xsapp";
  storeData: any;
  worksheet: any;
  EXCEL_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  EXCEL_EXTENSION = ".xlsx";

  ngOnInit() {
    this.fileName = "Inventory" + formatDate(new Date(), "yyyy-MM-dd", "en");
    this.isAdmin$ = this.authService.isAdmin$;
  }

  uploadedFile(event) {
    this.fileUploaded = event.target.files[0];
    this.readExcel();
  }

  readExcel() {
    console.log("starting");
    let readFile = new FileReader();
    readFile.onload = e => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
      const dat = XLSX.utils.sheet_to_json(this.worksheet, { raw: true });
      for (let row  of dat) {
        const inventory_item:Inventory = Inventory.makeInventory(row as any)
        console.log("create3", inventory_item.index);
        //if (inventory_item.image1) {
        //  this.inventoryService.getUrl(inventory_item.image1).subscribe(url => inventory_item.url1 = url);
        //}
        this.get_image_names(inventory_item)
        this.get_url_for_image(inventory_item).then(dat => this.inventoryService.createInventory(inventory_item))
        //this.inventoryService.createInventory(inventory_item);
      }
    };
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  get_image_names(inventory: Inventory){
    for (var i = 1; i<6; i++){
      inventory['image'+i] = Inventory.decode_image_name(inventory['file'+i]);
    }

  }

   async get_url_for_image(inventory: Inventory){
    for (let i = 1; i < 6; i++){
      if (inventory['image'+i] ) {
        inventory['url'+i]  = <string> await this.inventoryService.getUrl(inventory['image'+i]).toPromise()
       // this.inventoryService.createInventory(inventory);
        };
    }}
 //   this.inventoryService.createInventory(inventory);
 //   console.log('read' , inventory['image'+i])


  exportAsExcelFile(excelFileName: string): void {
    let json: any[] = this.inventoryService.inventory;
    console.log("writing", excelFileName, json);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"]
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    console.log("writing");
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + this.EXCEL_EXTENSION
    );
    console.log("written");
  }
}
