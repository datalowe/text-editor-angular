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
import { LoggedInGuard } from './guards/logged-in.guard';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';
import { DocumentEditorsListComponent } from './components/document-editors-list/document-editors-list.component';
import { GraphQLModule } from './graphql.module';

const config: SocketIoConfig = { 
  url: backendRootUrl, 
  options: {}
};

const appRoutes: Routes = [
  {path: 'login', component: LoginAreaComponent, canActivate: [NotLoggedInGuard]},
  {path: 'register', component: RegistrationAreaComponent, canActivate: [NotLoggedInGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'editor', component: EditorAreaComponent, canActivate: [LoggedInGuard]},
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
    DocumentEditorsListComponent,
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
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    GraphQLModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
