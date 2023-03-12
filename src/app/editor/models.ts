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

    isInvalid(): InvalidResult|undefined {
        if (!this.title || !this.section || !this._partition || !this.body || this.body.length==0){
            return {msg: 'Campos título, categoría o cuerpo vacios', invalidChords: []};
        }

        let invalidLines = [];
        let lines = this.body!!.filter(line => line.type === 'acorde')
        for (let line of lines){
            let chords = line.content!!.split(' ').filter(x => x !== '')
            let invalidChords = []
            for (let chord of chords) {
                let regex = /^(do|re|mi|fa|sol|la|si|DO|RE|MI|FA|SOL|LA|SI)(#|b)?([0-9]){0,2}(\/(do|re|mi|fa|sol|la|si|DO|RE|MI|FA|SOL|LA|SI)(#|b|B)?([0-9]){0,2})?$/
                if (!chord.match(regex)){
                    invalidChords.push(chord);
                }
            }
            if (invalidChords.length != 0){
                invalidLines.push({line: line, chords: invalidChords});
            }
        }

        if (invalidLines.length != 0){
            return {msg: 'Acordes con formato incorrecto', invalidChords: invalidLines};
        }

        return undefined;
    };
}

export interface InvalidResult {
    msg: string,
    invalidChords: InvalidChord[]
}

export interface InvalidChord {
    line: Line,
    chords: string[]
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