import { Component } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PrintLabelComponent {

  constructor(public printList) { }  
  label;

  generate_single(){
    let ret = [];
    if (!this.label.done){
      ret.push({text:this.label.value[0], fontSize:11, margin: [36,9,0,0]})
      for (let row of this.label.value.slice(1,4)){
          ret.push({text:row, fontSize:11, margin: [36,0,0,0]})
      }
    };
    this.label = this.printList.next()
    return ret;
  }

  generate_row(){
    return [this.generate_single(), this.generate_single(),this.generate_single()];
  }

  generate_page(){
    let ret = []
    for (let i=0; (i  < 10) && (!this.label.done); i++){
        ret.push(this.generate_row());
    }
    return ret;
  }

  generate_all(){
    let height = 72
    let ret =[];
    this.label = this.printList.next()
    for (let i =0; (!this.label.done); i++){
        let page = {
          //layout: 'noBorders',
          table: {
          headerRows: 0,
          widths: ['33%', '33%', '33%'],
          heights: height,
          body: this.generate_page(),
          },
        pageBreak: 'after'
      }
        ret.push(page);
      }
    return ret;
  }

  generatePdf() {
    let height = 72
    let documentDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [13, 36, 13, 36], //left top right bottom
    
      content: 
        this.generate_all()  
    };
  pdfMake.createPdf(documentDefinition).open();
  }
}