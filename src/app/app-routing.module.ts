import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizedLayoutComponent } from './authorized-layout/authorized-layout.component';
import { ContainerCreateEditComponent } from './containers/container-create-update/container-create-edit.component';
import { ContainersComponent } from './containers/containers.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { ItemAddNewComponent } from './items/item-add-new/item-add-new.component';
import { ItemAddComponent } from './items/item-add/item-add.component';
import { ItemEjectComponent } from './items/item-eject/item-eject.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import { AppRoutes } from './routes/app.routes';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        canActivateChild: [AuthorizedGuard],
        component: AuthorizedLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: AppRoutes.items.name
            },
            {
                path: AppRoutes.items.name,
                component: ItemsComponent,
                children: [
                    {
                        path: AppRoutes.items.add.name,
                        component: ItemAddNewComponent
                    },
                    {
                        path: AppRoutes.items.itemId.name,
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: AppRoutes.items.full()
                            },
                            {
                                path: AppRoutes.items.itemId.add.name,
                                component: ItemAddComponent
                            },
                            {
                                path: AppRoutes.items.itemId.eject.name,
                                component: ItemEjectComponent
                            }
                        ]
                    }
                ]
            },
            {
                path: AppRoutes.containers.name,
                component: ContainersComponent,
                children: [
                    {
                        path: AppRoutes.containers.add.name,
                        component: ContainerCreateEditComponent
                    },
                    {
                        path: AppRoutes.containers.containerId.name,
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: AppRoutes.containers.full()
                            },
                            {
                                path: AppRoutes.containers.containerId.edit.name,
                                component: ContainerCreateEditComponent
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
