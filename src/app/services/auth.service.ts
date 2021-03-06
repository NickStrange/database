import { Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebaseui from 'firebaseui';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ui: firebaseui.auth.AuthUI;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  userId$: Observable<string>;
  isReadWrite$: Observable<boolean>;
  name$: Observable<string>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }


  login() {
    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
    this.userId$ = this.afAuth.authState.pipe(map(user => user? user.uid: null));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));


    this.isAdmin$ = new Observable((observer: Subscriber <boolean>) => {
    this.userId$.subscribe(userid => {
      let isAdmin = this.db.doc(`users/${userid}`)
         .snapshotChanges().subscribe(snap => {
            let user = snap.payload.data() as User;
            observer.next(user? !!user.isAdmin: null)
           },
           err => console.log('Error in ', err))
      })
    });

    this.isReadWrite$ = new Observable((observer: Subscriber <boolean>) => {
      this.userId$.subscribe(userid => {
        let readWrite = this.db.doc(`users/${userid}`)
           .snapshotChanges().subscribe(snap => {
              let user = snap.payload.data() as User;
              observer.next(user? !!user.readWrite: null)
             },
             err => console.log('Error in ', err))
        })
      });
    
    this.name$ = new Observable((observer: Subscriber <string>) => {
    this.userId$.subscribe(userid => {
      let isAdmin = this.db.doc(`users/${userid}`)
         .snapshotChanges().subscribe(snap => {
            let user = snap.payload.data() as User;
            console.log('reading name', user)
            observer.next(user.name)
           },
           err => console.log('Error in ', err))
      })
    });  
   }

   setui(ui){
     this.ui = ui;
   }


  ngOnDestroy(){
    this.ui.delete();
  }

  logOut() {
    this.afAuth.auth.signOut();
  }
}