export class Song{
    title?: string;
    body?: Line[];
    section?: string;
    _partition?: string;

    constructor(title?: string, body?: Line[], section?: string, _partition?: string){
        this.title = title;
        this.body = body;
        this.section = section;
        this._partition = _partition;
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