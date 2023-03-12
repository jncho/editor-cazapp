import { Component, HostListener, OnInit } from '@angular/core';
import * as internal from 'stream';
import {ConfirmationService} from 'primeng/api';
import { Line, Song } from './models';
import {MessageService} from 'primeng/api';
import * as uuid from 'uuid';

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
  lastLineSelectedBackup?: CustomLine;
  lastLineSelected?: CustomLine;
  dynamicDownload?: HTMLElement;
  displayHelp: boolean = false;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService){}

  ngOnInit(): void {
    this.dynamicDownload = document.createElement('a');
    
  }

  downloadJson(): void {
    let song = this.createSong();
    let isInvalid = song.isInvalid();
    if (!isInvalid){
      this.dynamicDownload?.setAttribute('href',`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(song))}`);
      let filename = this.title!=undefined ? this.title?.trim().replace(/ +/g,"-") : 'custon-song';
      this.dynamicDownload?.setAttribute('download',`${filename}.json`);

      var event = new MouseEvent("click");
      this.dynamicDownload?.dispatchEvent(event);
    } else {
      this.messageService.add({severity:'error', summary:'Error de formato', detail:`${isInvalid.msg}`});
      //TODO Show errors in front end
    }
  }

  setLastLineSelected(line?: CustomLine): void{
    if (line?.id != this.lastLineSelected?.id){
      this.lastLineSelectedBackup = this.lastLineSelected;
    }
    this.lastLineSelected = line;
  }

  clearLastLineSelected(): void{
    this.lastLineSelectedBackup = this.lastLineSelected;
    this.lastLineSelected = undefined;
  }

  createSong(): Song{
    let song = new Song();

    song.title = this.title;
    song.body = [];
    for (let i=0 ; i<this.lines.length ; i++) {
      let customLine = this.lines[i];
      song.body.push(new Line(i+1,customLine.type,customLine.content));
    }
    song.section = this.selectedSection;
    song._partition = "Public Songs";

    return song;
  }

  addLine(text:string,type: ChordType,idLine?: string){
    let newSong = new CustomLine(text, type,false);
    let indexNewLine = this.lines.findIndex(line => line.id == idLine);
    if (indexNewLine == -1){
      this.lines.push(newSong);
    } else{
      this.lines.splice(indexNewLine,0,newSong);
    }
  }

  clear():void{
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      accept: () => {
        this.lines = [];
      }
    });
  }

  songIsValid(): boolean{
    let titleIsValid: boolean = (this.title != undefined) && (this.title.length!=0);
    let sectionIsValid: boolean = (this.selectedSection != undefined)
    let bodyIsValid: boolean = (this.lines.length >= 2)
    return titleIsValid && sectionIsValid && bodyIsValid;
  }

  showHelp(): void{
    this.displayHelp=true;
  }

  // Click Butons
  createLinesFromClipboard(): void{
    navigator.clipboard.readText().then(text => {
      let newLines = text.split('\n').map( (token,_) => new CustomLine(token,ChordType.NORMAL,false));
      let insertIndex = this.lastLineSelected != undefined ? this.lastLineSelected.id : this.lastLineSelectedBackup?.id;
      let indexNewLine = this.lines.findIndex(line => line.id == insertIndex)+1;
      this.lines.splice(indexNewLine,0,...newLines);
    });
  }

  addChord(): void{
    this.addLine('New Chord Line...',ChordType.CHORD,this.lastLineSelected?.id);
  }

  addNormal(): void{
      this.addLine('New Normal Line...',ChordType.NORMAL,this.lastLineSelected?.id);
  }

  addChorus(): void{
      this.addLine('New Chorus Line...',ChordType.CHORUS,this.lastLineSelected?.id);
  }

  changeToType(event: KeyboardEvent,type: ChordType){
    event.preventDefault();
    if (this.lastLineSelected != undefined){
      this.lastLineSelected.type = type;
    }
  }

  deleteLine(line: CustomLine): void{
    this.lines = this.lines.filter(l => l.id!=line.id);
  }

  // Keyboard Shortcuts
  @HostListener('window:keydown.control.shift.v',['$event'])
  createLinesFromClipboardShortcut(event: KeyboardEvent): void{
    event.preventDefault();
    this.createLinesFromClipboard();
  }

  @HostListener('window:keydown.control.a',['$event'])
  addChordShortcut(event: KeyboardEvent){
    event.preventDefault();
    this.addChord();
  }

  @HostListener('window:keydown.control.s',['$event'])
  addNormalShortcut(event: KeyboardEvent){
    event.preventDefault();
    this.addNormal();
  }

  @HostListener('window:keydown.control.d',['$event'])
  addChorusShortcut(event: KeyboardEvent){
    event.preventDefault();
    this.addChorus();
  }

  @HostListener('window:keydown.control.r',['$event'])
  removeLineShortcut(event: KeyboardEvent){
    event.preventDefault();
    if (this.lastLineSelected != undefined){
      this.deleteLine(this.lastLineSelected);
      this.lastLineSelected = undefined;
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
  id: string = "";
  type: ChordType = ChordType.NORMAL;
  marked: boolean = false;

  constructor(content: string,type: ChordType,marked: boolean){
    this.id = uuid.v4();
    this.content = content;
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
