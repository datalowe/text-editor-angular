import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './routing/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { CookieService } from 'ngx-cookie-service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { QuillModule } from 'ngx-quill';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { EditorAreaComponent } from './components/editor-area/editor-area.component';
import { EditorToolbarComponent } from './components/editor-toolbar/editor-toolbar.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
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
import { MatIconModule } from '@angular/material/icon'; 
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBarModule } from '@angular/material/snack-bar'; 

import { backendRootUrl } from './global-variables';
import { LoggedInGuard } from './guards/logged-in.guard';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';
import { DocumentEditorsListComponent } from './components/document-editors-list/document-editors-list.component';
import { GraphQLModule } from './graphql/graphql.module';
import { DocInviteDialogComponent } from './components/doc-invite-dialog/doc-invite-dialog.component';
import { QuillWrapperComponent } from './components/quill-wrapper/quill-wrapper.component';
import { CodeMirrorWrapperComponent } from './components/code-mirror-wrapper/code-mirror-wrapper.component';

const config: SocketIoConfig = { 
  url: backendRootUrl, 
  options: {}
};

const appRoutes: Routes = [
  {path: 'login', component: LoginAreaComponent, canActivate: [NotLoggedInGuard]},
  {path: 'register', component: RegistrationAreaComponent, canActivate: [NotLoggedInGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'editor', component: EditorAreaComponent, canActivate: [LoggedInGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'prefix'}
];

@NgModule({
  declarations: [
    AppComponent,
    EditorAreaComponent,
    EditorToolbarComponent,
    DocumentListComponent,
    LoginAreaComponent,
    RegistrationAreaComponent,
    DocumentEditorsListComponent,
    DocInviteDialogComponent,
    QuillWrapperComponent,
    CodeMirrorWrapperComponent,
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
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatToolbarModule,
    QuillModule.forRoot(),
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    GraphQLModule,
    CodemirrorModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
