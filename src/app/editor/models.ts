export class Song{
    title?: string;
    section?: string;
    _partition?: string;
    body?: Line[];

    constructor(title?: string,section?: string,_partition?: string,body?: Line[]){
        this.title = title;
        this.section = section;
        this._partition = _partition;
        this.body = body;
    }

    isValid(): boolean {
        return this.title!=null 
                && this.section!=null 
                && this._partition!=null 
                && this.body!=null
                && this.body.length>1;
    };
}

export class Line{
    line?: number;
    type?: string;
    content?: string;

    constructor(line?: number,type?: string,content?: string){
        this.line = line;
        this.type = type;
        this.content = content;
    }
}