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