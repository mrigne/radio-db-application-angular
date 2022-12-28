import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainersComponent } from './containers/containers.component';
import { ItemsComponent } from './items/items.component';

const routes: Routes = [
    {
        path: 'items',
        component: ItemsComponent
    },
    {
        path: 'containers',
        component: ContainersComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
