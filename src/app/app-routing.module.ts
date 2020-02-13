import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryCreateComponent } from './inventory-create/inventory-create.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { FilesComponent } from './files/files.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path:  "", pathMatch:  "full",redirectTo:  "home"},
  {path: "home", component: LoginComponent},
  {path: "contact-create", 
      children: [
        {
          path: '',
          component: InventoryCreateComponent
        },
        {
          path: ':id',
          component: InventoryCreateComponent
        }
      ]
    },
  {path: "inventory-list", component: InventoryListComponent},
  {path: "files", component: FilesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
