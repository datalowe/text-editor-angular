import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';


import { QuillModule } from 'ngx-quill';
import { EditorAreaComponent } from './components/editor-area/editor-area.component';
import { ButtonComponent } from './components/button/button.component';
import { EditorToolbarComponent } from './components/editor-toolbar/editor-toolbar.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentListItemComponent } from './components/document-list-item/document-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorAreaComponent,
    ButtonComponent,
    EditorToolbarComponent,
    DocumentListComponent,
    DocumentListItemComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
