import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from '../routes/app.routes';
import { ItemsComponent } from './components/items.component';
import { ItemAddNewComponent } from './item-add-new/item-add-new.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemEjectComponent } from './item-eject/item-eject.component';

const routes: Routes = [
    {
        path: '',
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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemsRoutingModule {

}
