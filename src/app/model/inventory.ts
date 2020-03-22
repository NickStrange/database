import { Observable } from 'rxjs';


export class Inventory {

    url$: Observable<string>;

    constructor(   
        public index:string = '',
        public item_id:string = '',
        public source:string = '',
        public notes:string = '',
        public location:string = '',
        public value:string = '',
        public inventory_date:string = '',
        public selected_file_placeholder:string = '',
        public title:string = '',
        public series:string = '',
        public type:string = '',
        public date_year:string = '',
        public medium:string = '',
        public signatures_and_writing:string = '',
        public condition:string = '',
        public category:string = '',
        public height:string = '',
        public width:string = '',
        public depth:string = '',
        public size_notes:string = '',
        public size_units:string = '',
        public dimensions:string = '',
        public file1:string = '',
        public file2:string = '',
        public file3:string = '',
        public file4:string = '',
        public file5:string = '',
        public image1:string = '',
        public image2:string = '',
        public image3:string = '',
        public image4:string = '',
        public image5:string = '',
        public url1:string = '',
        public url2:string = '',
        public url3:string = '',
        public url4:string = '',
        public url5:string = ''  ){
    }

    public static makeInventory(row): Inventory{
        let inventory = new Inventory(
            row.index,
            row.item_id,
            row.source,
            row.notes,
            row.location,
            row.value,
            row.inventory_date,
            row.selected_file_placeholder,
            row.title,
            row.series,
            row.type,
            row.date_year,
            row.medium,
            row.signatures_and_writing,
            row.condition,
            row.category,
            row.height,
            row.width,
            row.depth,
            row.size_notes,
            row.size_units,
            row.dimensions,
            row.file1,
            row.file2,
            row.file3,
            row.file4,
            row.file5,
            row.image1,
            row.image2,
            row.image3,
            row.image4,
            row.image5,
            row.url1,
            row.url2,
            row.url3,
            row.url4,
            row.url5
        );

        return inventory;
    }

    public static decode_image_name(val): string{
        const myRe = /.*remote:(.*(jpg|JPG)).*/;
        const result = (myRe.exec(val));
            if (result){    
                const file = result[1].replace('JPG','jpg')
                try{
                    console.log('SEARCH',val, 'FOUND', file);
                    return file
                }
                catch (FirebaseStorageError){
                    console.log('cant read  ', file);
                    return('Unknown File')
                   }
            }
        return '';
    }

                
    toString():string{
        return (
        this.index + " " +
        this.item_id + " " +
        this.source + " " +
        this.notes+ " " +
        this.location + " " +
        this.value + " " +
        this.inventory_date + " " +
        this.selected_file_placeholder + " " +
        this.title + " " +
        this.series + " " +
        this.type + " " +
        this.date_year + " " +
        this.medium + " " +
        this.signatures_and_writing + " " +
        this.condition + " " +
        this.category + " " +
        this.height + " " +
        this.width + " " +
        this.depth + " " +
        this.size_notes + " " +
        this.size_units + " " +
        this.dimensions + " "
        );
    }
    
    includes_string(search: string){
        // test if string is in the inventory
        return this.toString() == undefined || this.toString().toLowerCase().includes(search.toLowerCase());
    }

    shortName(){
        return `${this.item_id} ${this.title} ${this.title} ${this.series}`
    }
}