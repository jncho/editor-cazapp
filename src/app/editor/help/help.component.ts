import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css']
  })
  export class HelpComponent {

    // Parameters
    private _display = false;
    @Input() set display(value: boolean) {
        this._display = value;
        this.displayChange.emit(value);
    }

    get display(){
        return this._display;
    }

    @Output() displayChange = new EventEmitter<boolean>();

    // Atributtes
    title = "Commands";
    commands = [
        { key: "Ctrl+A", desc:"<b>Añade una linea de acordes</b> delante de aquella linea en el que tengas el cursor." },
        { key: "Ctrl+S", desc:"<b>Añade una linea de letra delante</b> de aquella linea en el que tengas el cursor." },
        { key: "Ctrl+D", desc:"<b>Añade una linea de letra</b> para el estribillo delante de aquella linea en el que tengas el cursor." },
        { key: "Alt+A", desc:"<b>Convierte</b> la linea en el que tengas el cursor <b>a una linea de acordes.</b>" },
        { key: "Alt+S", desc:"<b>Convierte</b> la linea en el que tengas el cursor <b>a una linea de letra.</b>" },
        { key: "Alt+D", desc:"<b>Convierte</b> la linea en el que tengas el cursor <b>a una linea de letra para el estribillo.</b>" },
        { key: "Ctrl+Shift+V", desc:"<b>Vuelca en lineas lo que tengas en el portapapeles</b> delante de aquella linea en el que tengas el cursor." },
        { key: "Ctrl+R", desc:"<b>Elimina</b> aquella linea en el que tengas el cursor." }
    ]

  }