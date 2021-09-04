import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QuillModule } from 'ngx-quill';
import { EditorAreaComponent } from './components/editor-area/editor-area.component';
import { ButtonComponent } from './components/button/button.component'

@NgModule({
  declarations: [
    AppComponent,
    EditorAreaComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
