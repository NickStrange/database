import { Component, ViewChild } from '@angular/core';  
import { Contact } from '../model/contact';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { ContactService } from '../services/contact.service';
import { AngularCsv } from 'angular7-csv';
import { formatDate } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';


@Component({  
  selector: 'app-filest',  
  templateUrl: './files.component.html',  
  styleUrls: ['./files.component.css']  
})  
  
export class FilesComponent {  

  constructor(private dataService: ContactService, 
    private dialogService:DialogService,
    private authService: AuthService) { }
  fileName = "Contacts"
  isAdmin$ :Observable<boolean>;

  ngOnInit() {
    this.fileName="Contacts"+formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.isAdmin$ = this.authService.isAdmin$;
  }
  
  writeCsv(){
    if (!this.fileName.trim()){
    this.dialogService.openDialog('Error', 'Enter FileName', 'close', '')
    this.fileName="Contacts"+formatDate(new Date(), 'yyyy-MM-dd', 'en'); 
  }
    else {
    this.dataService.contacts$.subscribe(contacts=>{
       new AngularCsv(JSON.parse(JSON.stringify(contacts)), this.fileName);
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
        let contact: Contact = new Contact(  
            Number(curruntRecord[0].trim()),
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
            curruntRecord[11].trim());
        csvArr.push(contact)
        this.dataService.createContact(contact);

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
