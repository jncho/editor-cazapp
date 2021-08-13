import { Component, HostListener, OnInit } from '@angular/core';
import * as internal from 'stream';
import {ConfirmationService} from 'primeng/api';
import { Line, Song } from './models';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [MessageService]
})
export class EditorComponent implements OnInit{
  title?: string;
  lines : CustomLine[] = [];
  sections: string[] = ["Accion de gracias","Adviento","Cuaresma","Don Bosco","Espíritu Santo","Himnos","Infantiles","María","Navidad","Pascua","Salmos y cánticos",
"Semana santa","Varios","Vocacionales","Ampliación","Ampliación II"];
  selectedSection?: string;

  chordType = ChordType;
  lastLineSelected?: CustomLine;

  dynamicDownload?: HTMLElement;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService){}

  ngOnInit(): void {
    this.dynamicDownload = document.createElement('a');
    
  }

  downloadJson(): void {
    let song = this.createSong();
    if (song.isValid()){
      this.dynamicDownload?.setAttribute('href',`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(song))}`);
      let filename = this.title!=undefined ? this.title?.trim().replace(/ +/g,"-") : 'custon-song';
      this.dynamicDownload?.setAttribute('download',`${filename}.json`);

      var event = new MouseEvent("click");
      this.dynamicDownload?.dispatchEvent(event);
    } else {
      this.messageService.add({severity:'error', summary:'Error de formato', detail:'No se cumple el formato propueseto de la canción.'});
    }
  }

  setLastLineSelected(line?: CustomLine): void{
    this.lastLineSelected = line;
  }

  createSong(): Song{
    let song = new Song();

    song.title = this.title;
    song.section = this.selectedSection;
    song._partition = "PUBLIC";
    song.body = [];
    for (let i=0 ; i<this.lines.length ; i++) {
      let customLine = this.lines[i];
      song.body.push(new Line(i+1,customLine.type,customLine.content));
    }

    return song;
  }

  addNextLine(idLine: number,text:string,type: ChordType){
    let indexNewLine = this.lines.findIndex(line => line.id == idLine)+1;
    this.lines.splice(indexNewLine,0,new CustomLine(text, this.lines.length, type,false));
  }

  addLine(text:string,type: ChordType): void{
    this.lines.push(new CustomLine(text, this.lines.length, type,false));
  }

  deleteLine(line: CustomLine): void{
    this.lines = this.lines.filter(l => l.id!=line.id);
  }

  clear():void{
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      accept: () => {
        this.title = undefined;
        this.lines = [];
        this.selectedSection = undefined;
      }
    });
  }

  createLinesFromClipboard(): void{
    // Firefox -> Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0
    // Chrome -> Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 
    console.log(window.navigator.userAgent);
   
    navigator.clipboard.readText().then(text => {
      this.lines = text.split('\n').map( (token,index) => new CustomLine(token,index,ChordType.NORMAL,false));
    });
  }

  songIsValid(): boolean{
    let titleIsValid: boolean = (this.title != undefined) && (this.title.length!=0);
    let sectionIsValid: boolean = (this.selectedSection != undefined)
    let bodyIsValid: boolean = (this.lines.length >= 2)
    return titleIsValid && sectionIsValid && bodyIsValid;
  }

  @HostListener('window:keydown.control.shift.v',['$event'])
  createLinesFromClipboardShotcut(event: KeyboardEvent): void{
    event.preventDefault();
    this.createLinesFromClipboard();
  }

  @HostListener('window:keydown.control.a',['$event'])
  addChord(event: KeyboardEvent){
    event.preventDefault();
    if (this.lastLineSelected != undefined){
      this.addNextLine(this.lastLineSelected.id,'New Chord Line...',ChordType.CHORD)
    }else{
      this.addLine('New Chord Line...',ChordType.CHORD)
    }
  }

  @HostListener('window:keydown.control.s',['$event'])
  addNormal(event: KeyboardEvent){
    event.preventDefault();
    if (this.lastLineSelected != undefined){
      this.addNextLine(this.lastLineSelected.id,'New Normal Line...',ChordType.NORMAL)
    }else{
      this.addLine('New Chord Line...',ChordType.NORMAL)
    }
  }

  @HostListener('window:keydown.control.d',['$event'])
  addChorus(event: KeyboardEvent){
    event.preventDefault();
    if (this.lastLineSelected != undefined){
      this.addNextLine(this.lastLineSelected.id,'New Chorus Line...',ChordType.CHORUS)
    }else{
      this.addLine('New Chord Line...',ChordType.CHORUS)
    }
  }

  @HostListener('window:keydown.control.r',['$event'])
  removeLine(event: KeyboardEvent){
    event.preventDefault();
    if (this.lastLineSelected != undefined){
      this.deleteLine(this.lastLineSelected);
      this.lastLineSelected = undefined;
    }
  }

  changeToType(event: KeyboardEvent,type: ChordType){
    event.preventDefault();
    if (this.lastLineSelected != undefined){
      this.lastLineSelected.type = type;
    }
  }

  @HostListener('window:keydown.alt.a',['$event'])
  changeToChord(event: KeyboardEvent){
    this.changeToType(event,ChordType.CHORD);
  }
  @HostListener('window:keydown.alt.s',['$event'])
  changeToNormal(event: KeyboardEvent){
    this.changeToType(event,ChordType.NORMAL);
  }
  @HostListener('window:keydown.alt.d',['$event'])
  changeToChorus(event: KeyboardEvent){
    this.changeToType(event,ChordType.CHORUS);
  }
}

export class CustomLine {
  content: string = "";
  id: number = 0;
  type: ChordType = ChordType.NORMAL;
  marked: boolean = false;

  constructor(content: string,id: number,type: ChordType,marked: boolean){
    this.content = content;
    this.id = id;
    this.type = type;
    this.marked = marked;
  }

  setMarked(marked: boolean): void{
    this.marked = marked;
  }
}

export enum ChordType {
  NORMAL="normal",
  CHORD="acorde",
  CHORUS="estribillo"
}
