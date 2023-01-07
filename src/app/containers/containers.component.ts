import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';
import { containersActions, containersSelector, IContainer } from '../reducers/containers';
import { IItem } from '../reducers/items';
import { AppRoutes } from '../routes/app.routes';
import { ContainerDeleteComponent } from './container-delete/container-delete.component';

@Component({
    selector: 'rdb-containers',
    templateUrl: './containers.component.html',
    styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit, OnDestroy {
    public readonly appRoutes = AppRoutes;

    public containers$ = this.store.select(containersSelector);

    public dataSource = new MatTableDataSource<IContainer>([]);

    private subscription: Subscription;

    constructor(private store: Store, private dialog: Dialog) {
    }

    public ngOnInit(): void {
        this.store.dispatch(containersActions.loadContainersFromApi());
        this.subscription = this.containers$.pipe(
            tap(containers => {
                this.dataSource.data = containers;
            })
        ).subscribe();
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onDelete(container: IItem): void {
        this.dialog.open(ContainerDeleteComponent, {
            width: '30%',
            minWidth: '350px',
            data: container
        })
    }
}

