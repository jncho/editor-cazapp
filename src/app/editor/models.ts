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

    isInvalid(): InvalidResult|null {
        if (this.title!=null && this.section!=null && this._partition!=null && this.body!=null && this.body.length>1){
            return {msg: 'Field title, section or body empty'};
        }

        let invalidLines = [];
        let lines = this.body!!.filter(line => line.type === 'acorde')
        for (let line of lines){
            let chords = line.content!!.split(' ').filter(x => x !== '')
            let invalidChords = []
            for (let chord of chords) {
                let regex = /^(do|re|mi|fa|sol|la|si)(#|b)?([0-9]){0,2}(\/(do|re|mi|fa|sol|la|si)(#|b)?([0-9]){0,2})?$/i
                if (!chord.match(regex)){
                    invalidChords.push(chord);
                }
            }
            if (invalidChords.length != 0){
                invalidLines.push({line: line, chords: invalidChords});
            }
        }

        if (invalidLines.length != 0){
            console.log('Error of validation in chord lines');
            return {msg: 'Chords with wrong format', invalidChords: invalidLines};
        }

        return null;
    };
}

interface InvalidResult {
    msg: string,
    invalidChords?: InvalidChord[]
}

interface InvalidChord {
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