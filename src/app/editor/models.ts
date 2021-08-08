export class Song{
    title?: string;
    section?: string;
    _partition?: string;
    body?: Line[];
}

export class Line{
    line?: string;
    type?: string;
    content?: string;
}