import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ContactCreateComponent } from "./contact-create/contact-create.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { HeaderComponent } from "./header/header.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FilesComponent } from './files/files.component';
import {AngularFireModule} from '@angular/fire';
import { environment } from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { DialogComponent } from './dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule, MatFormFieldModule } from '@angular/material';



@NgModule({
  declarations: [
    AppComponent,
    ContactCreateComponent,
    ContactListComponent,
    HeaderComponent,
    FilesComponent,
    LoginComponent,
    DialogComponent,
    DialogComponent
  ],
  imports: [BrowserModule, 
    AppRoutingModule, 
    FormsModule, 
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatDialogModule],
  providers: [AngularFirestore],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule {}
