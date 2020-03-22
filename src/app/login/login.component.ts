import { Component, OnInit} from '@angular/core';
import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    ui: firebaseui.auth.AuthUI;

    constructor(private afAuth: AngularFireAuth,
      private authService: AuthService,
      private inventoryService: InventoryService) { }
  
    ngOnInit() {
      console.log('new ui');
      this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.afAuth.auth);
      this.authService.setui(this.ui);
      this.logIn();
      }  

    logIn(){
      const uiConfig = {
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
  
            signInSuccessWithAuthResult: this
                .onLoginSuccessful
                .bind(this)
         }
      };
  
      this.ui.start('#firfebaseui-auth-container', uiConfig);
      this.authService.login();
     }
  
    onLoginSuccessful(result){
      this.inventoryService.clear_inventory();
      this.inventoryService.doInventory();
    }
  
    logOut() {
      this.authService.logOut();
    }
}
