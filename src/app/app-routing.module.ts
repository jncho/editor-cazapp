import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: '',   redirectTo: '/cazapp-editor',pathMatch: 'full'},
  { path: 'cazapp-editor', component: EditorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
