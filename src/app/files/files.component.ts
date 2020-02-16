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
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


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

  fileUploaded: File;
title = 'xsapp';
storeData:any;
worksheet:any;
EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
EXCEL_EXTENSION = '.xlsx';



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
      this.exportAsExcelFile(this.fileName);
      })
    }
  }
  
  // public records: any[] = [];  
  // @ViewChild('csvReader', {static: true}) csvReader: any;  
  
  // uploadListener($event: any): void {  
  
  //   let text = [];  
  //   let files = $event.srcElement.files;  
  
  //   if (this.isValidCSVFile(files[0])) {  
  
  //     let input = $event.target;  
  //     let reader = new FileReader();  
  //     reader.readAsText(input.files[0]);  
  
  //     reader.onload = () => {  
  //       let csvData = reader.result;  
  //       let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
  //       let headersRow = this.getHeaderArray(csvRecordsArray);  
  
  //       this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
  //     };  

  //     reader.onerror = function () {  
  //       console.log('error is occured while reading file!');  
  //     };  
  
  //   } else {  
  //     alert("Please import valid .csv file.");  
  //     this.fileReset();  
  //   }  
  // }  
  
  // getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
  //   let csvArr = [];  
  
  //   for (let i = 1; i < csvRecordsArray.length; i++) {  
  //     let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
  //     console.log(curruntRecord);
  //     if (curruntRecord.length >= headerLength) {  
  //       console.log(curruntRecord);
  //       let inventory: Inventory = new Inventory(  
  //           curruntRecord[0].trim(),
  //           curruntRecord[1].trim(),
  //           curruntRecord[2].trim(),  
  //           curruntRecord[3].trim(),
  //           curruntRecord[4].trim(),
  //           curruntRecord[5].trim(),  
  //           curruntRecord[6].trim(),  
  //           curruntRecord[7].trim(), 
  //           curruntRecord[8].trim(),
  //           curruntRecord[9].trim(), 
  //           curruntRecord[10].trim(),
  //           curruntRecord[11].trim(),
  //           curruntRecord[12].trim(),  
  //           curruntRecord[13].trim(),
  //           curruntRecord[14].trim(),
  //           curruntRecord[15].trim(),  
  //           curruntRecord[16].trim(),  
  //           curruntRecord[17].trim(), 
  //           curruntRecord[18].trim(),
  //           curruntRecord[19].trim(), 
  //           curruntRecord[20].trim(),
  //           curruntRecord[21].trim(),
  //           curruntRecord[22].trim(),  
  //           curruntRecord[23].trim(),
  //           curruntRecord[24].trim(),
  //           curruntRecord[25].trim(),  
  //           curruntRecord[26].trim(),
  //           curruntRecord[27].trim());
  //       csvArr.push(inventory)
  //       this.dataService.createInventory(inventory);

  //     }  
  //   }  
  //   return csvArr;  
  // }  

  // isValidCSVFile(file: any) {  
  //   return file.name.endsWith(".csv");  
  // }  
  
  // getHeaderArray(csvRecordsArr: any) {  
  //   let headers = (<string>csvRecordsArr[0]).split(',');  
  //   let headerArray = [];  
  //   for (let j = 0; j < headers.length; j++) {  
  //     headerArray.push(headers[j]);  
  //   }  
  //   return headerArray;  
  // }  
  
  // fileReset() {  
  //   this.csvReader.nativeElement.value = "";  
  //   this.records = [];  
  // }  



  uploadedFile(event){
    this.fileUploaded=event.target.files[0];
    this.readExcel();
    }
    
    readExcel() {
    console.log('starting');
    let readFile = new FileReader();
    readFile.onload = (e) => {
    this.storeData = readFile.result;
    var data = new Uint8Array(this.storeData);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    this.worksheet = workbook.Sheets[first_sheet_name];
    const dat = XLSX.utils.sheet_to_json (this.worksheet, {raw:true});
    console.log(dat);
    for (let inventory_json of dat){
      let row = this.dataService.convert_from_json(inventory_json);
      console.log('create', row);
      this.dataService.createInventory(row);
      }
    }
    readFile.readAsArrayBuffer(this.fileUploaded)
    }
    
    exportAsExcelFile(excelFileName: string): void {
      let json: any[] = this.dataService.convert_to_json();
      console.log('writing', excelFileName, json)
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }
  
    saveAsExcelFile(buffer: any, fileName: string): void {
    console.log('writing');
    const data: Blob = new Blob([buffer], {type: this.EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
    console.log('written');
    }
} 
