import { Observable } from 'rxjs';

export class Inventory {

    url$: Observable<string>;

    constructor(
                public item_id: string,
                public source: string,
                public notes: string,
                public location: string,
                public value: string,
                public inventory_date: string,
                public selected_file_placeholder: string,
                public artist_name: string,
                public title: string,
                public series: string,
                public type: string,
                public date_year: string,
                public medium: string,
                public signatures_and_writing: string,
                public condition: string,
                public category: string,
                public height: string,
                public width: string,
                public depth: string,
                public size_notes: string,
                public size_units: string,
                public dimensions: string,
                public selected_file_container: string,
                public file1: string,
                public file2: string,
                public file3: string,
                public file4: string,
                public file5: string){}

     setUrl(url){
         this.url$=url;
     }
            
     getUrl():Observable<string>{
       return this.url$;
    }
                
    
    toString():string{
        return (
        this.item_id + " " +
        this.source + " " +
        this.notes+ " " +
        this.location + " " +
        this.value + " " +
        this.inventory_date + " " +
        this.selected_file_placeholder + " " +
        this.artist_name + " " +
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
        this.selected_file_container + " " +
        this.file1 + " " +
        this.file2 + " " +
        this.file3 + " " +
        this.file4 + " " +
        this.file5);
    }
    
    includes_string(search: string){
        // test if string is in the inventory
        return this.toString() == undefined || this.toString().toLowerCase().includes(search.toLowerCase());
    }

    shortName(){
        return `${this.item_id} ${this.title} ${this.title} ${this.series}`
    }
}