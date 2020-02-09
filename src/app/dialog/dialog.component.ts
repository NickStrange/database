import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA } from "@angular/material";


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  description = String;

  constructor(private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { 
      this.description = data.description;
    }

  ngOnInit() {
  }

  click_false(){
    this.dialogRef.close(false);
  }

  click_true(){
    this.dialogRef.close(true);
  }

}
