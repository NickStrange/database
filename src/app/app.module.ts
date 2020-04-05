import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
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

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryCreateComponent } from './inventory-create/inventory-create.component';
import { ScrollingModule } from '@angular/cdk/scrolling';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FilesComponent,
    LoginComponent,
    DialogComponent,
    DialogComponent,
    InventoryListComponent,
    InventoryCreateComponent
  ],
  imports: [BrowserModule, 
    ScrollingModule,
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
