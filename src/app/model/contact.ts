export class Contact {

    constructor(
                public id: number,
                public title: string,
                public first_name: string, 
                public last_name: string, 
                public phone: string, 
                public email: string,
                public company: string,
                public address: string,
                public city: string,
                public country: string,
                public state: string,
                public post_code: string
                ){
    }
    
    toString(){
        return this.id + " " + this.title + " " + this.first_name +
        " " + this.last_name + " " + this.phone + " " + this.email + 
        " " + this.company + " " + this.address + " " + this.city  + 
        " " + this.country + " " + this.state + " " + this.post_code;
    }
    
    includes_string(search: string){
        // test if string is in the contact
        return this.toString().toLowerCase().includes(search.toLowerCase());
    }

    shortName(){
        return `${this.id} ${this.title} ${this.first_name} ${this.last_name}`
    }

    is_valid_address(){
        return this.address != '';
    }

}