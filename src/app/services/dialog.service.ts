import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog,) { }

  openDialog(description: String, msg: String, label1: String, label2: String)  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { description:description, name: msg, label1:label1, label2:label2};
    let dialogRef= this.dialog.open(DialogComponent, dialogConfig);
   // dialogRef.afterClosed().subscribe (result => console.log(`dialog result: ${result}`));
    return dialogRef.afterClosed();
  }
}
