import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from '../routes/app.routes';
import { ContainersComponent } from './components/containers.component';
import { ContainerCreateEditComponent } from './container-create-update/container-create-edit.component';

const routes: Routes = [
    {
        path: '',
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContainersRoutingModule {

}
