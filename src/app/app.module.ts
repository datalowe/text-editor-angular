import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { CookieService } from 'ngx-cookie-service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { QuillModule } from 'ngx-quill';

import { EditorAreaComponent } from './components/editor-area/editor-area.component';
import { ButtonComponent } from './components/button/button.component';
import { EditorToolbarComponent } from './components/editor-toolbar/editor-toolbar.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentListItemComponent } from './components/document-list-item/document-list-item.component';
import { LoginAreaComponent } from './components/login-area/login-area.component';
import { RegistrationAreaComponent } from './components/registration-area/registration-area.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 

import { backendRootUrl } from './global-variables';

const config: SocketIoConfig = { 
  url: backendRootUrl, 
  options: {}
};

const appRoutes: Routes = [
  {path: 'login', component: LoginAreaComponent},
  {path: 'register', component: RegistrationAreaComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'editor', component: EditorAreaComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    EditorAreaComponent,
    ButtonComponent,
    EditorToolbarComponent,
    DocumentListComponent,
    DocumentListItemComponent,
    LoginAreaComponent,
    RegistrationAreaComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    QuillModule.forRoot(),
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
