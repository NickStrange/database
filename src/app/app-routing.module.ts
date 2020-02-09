import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { FilesComponent } from './files/files.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path:  "", pathMatch:  "full",redirectTo:  "home"},
  {path: "home", component: LoginComponent},
  {path: "contact-create", 
      children: [
        {
          path: '',
          component: ContactCreateComponent
        },
        {
          path: ':id',
          component: ContactCreateComponent
        }
      ]
    },
  {path: "contact-list", component: ContactListComponent},
  {path: "files", component: FilesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
