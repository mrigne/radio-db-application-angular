import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizedLayoutComponent } from './authorized-layout/authorized-layout.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { AppRoutes } from './routes/app.routes';

const routes: Routes = [
    {
        path: AppRoutes.login.login.name,
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
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
                loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
            },
            {
                path: AppRoutes.containers.name,
                loadChildren: () => import('./containers/containers.module').then(m => m.ContainersModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthorizedGuard]
})
export class AppRoutingModule { }
