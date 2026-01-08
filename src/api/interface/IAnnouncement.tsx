export interface Iinterface {

    create(messafe:IAnnoncement):string;
    get(id:string):string
    delete(id:string):string;
    update(id:string):string;
    softdelete(id:string):string
}


export interface IAnnoncement{
    message:string
}

