import { Component, ViewChild } from '@angular/core';  
import { InventoryListComponent } from '../inventory-list/inventory-list.component';
import { InventoryService } from '../services/inventory.service';
import { AngularCsv } from 'angular7-csv';
import { formatDate } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Inventory } from '../model/inventory';


@Component({  
  selector: 'app-filest',  
  templateUrl: './files.component.html',  
  styleUrls: ['./files.component.css']  
})  
  
export class FilesComponent {  

  constructor(private dataService: InventoryService, 
    private dialogService:DialogService,
    private authService: AuthService) { }
  fileName = "Inventory"
  isAdmin$ :Observable<boolean>;

  ngOnInit() {
    this.fileName="Inventory"+formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.isAdmin$ = this.authService.isAdmin$;
  }
  
  writeCsv(){
    if (!this.fileName.trim()){
    this.dialogService.openDialog('Error', 'Enter FileName', 'close', '')
    this.fileName="Contacts"+formatDate(new Date(), 'yyyy-MM-dd', 'en'); 
  }
    else {
    this.dataService.inventory$.subscribe(inventory=>{
       new AngularCsv(JSON.parse(JSON.stringify(inventory)), this.fileName);
         })
    }
  }
  
  public records: any[] = [];  
  @ViewChild('csvReader', {static: true}) csvReader: any;  
  
  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
      };  

      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }  
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let inventory: Inventory = new Inventory(  
            curruntRecord[0].trim(),
            curruntRecord[1].trim(),
            curruntRecord[2].trim(),  
            curruntRecord[3].trim(),
            curruntRecord[4].trim(),
            curruntRecord[5].trim(),  
            curruntRecord[6].trim(),  
            curruntRecord[7].trim(), 
            curruntRecord[8].trim(),
            curruntRecord[9].trim(), 
            curruntRecord[10].trim(),
            curruntRecord[11].trim(),
            curruntRecord[12].trim(),  
            curruntRecord[13].trim(),
            curruntRecord[14].trim(),
            curruntRecord[15].trim(),  
            curruntRecord[16].trim(),  
            curruntRecord[17].trim(), 
            curruntRecord[18].trim(),
            curruntRecord[19].trim(), 
            curruntRecord[20].trim(),
            curruntRecord[21].trim(),
            curruntRecord[22].trim(),  
            curruntRecord[23].trim(),
            curruntRecord[24].trim(),
            curruntRecord[25].trim(),  
            curruntRecord[26].trim());
        csvArr.push(inventory)
        this.dataService.createInventory(inventory);

      }  
    }  
    return csvArr;  
  }  

  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  
} 
