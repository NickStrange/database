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
        public url1:string = '',
        public url2:string = '',
        public url3:string = '',
        public url4:string = '',
        public url5:string = ''  ){
        console.log('constructor create', this.toString());
    }

    public static makeInventory(row): Inventory{
        return new Inventory(
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
            row.url1,
            row.url2,
            row.url3,
            row.url4,
            row.url5   
        );
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
        this.dimensions + " " +
        this.file1 + " " +
        this.file2 + " " +
        this.file3 + " " +
        this.file4 + " " +
        this.file5 + " " +
        this.url1 + " " +
        this.url2 + " " +
        this.url3 + " " +
        this.url4 + " " +
        this.url5    
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