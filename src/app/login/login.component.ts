import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    ui: firebaseui.auth.AuthUI;

    constructor(private afAuth: AngularFireAuth, private db: AngularFirestore,
      private router:Router, private ngZone: NgZone, private authService: AuthService) { }
  
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
      console.log(result);
      this.ngZone.run(() => this.router.navigateByUrl('/contact-list'));
    }
  
    logOut() {
      this.authService.logOut();
    }
}
