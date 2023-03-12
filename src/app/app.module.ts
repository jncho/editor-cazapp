import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DropdownModule} from 'primeng/dropdown';
import { TestComponent } from './test/test.component';
import { EditorComponent } from './editor/editor.component';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import { HelpComponent } from './editor/help/help.component';
import {FieldsetModule} from 'primeng/fieldset';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,  
    EditorComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TooltipModule,
    ConfirmDialogModule,
    BrowserAnimationsModule,
    DropdownModule,
    ToastModule,
    DialogModule,
    FieldsetModule,
    TabViewModule,
    TableModule
  ],
  providers: [ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
