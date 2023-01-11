import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription, tap } from 'rxjs';
import { containersActions, containersSelector, IContainer } from '../../reducers/containers';
import { IItem, itemsActions, itemsSelector } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';
import { ContainerDeleteComponent } from '../container-delete/container-delete.component';

export interface IContainerWithItemsAmount extends IContainer {
    itemsAmount?: number;
}

@Component({
    selector: 'rdb-containers',
    templateUrl: './containers.component.html',
    styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements AfterViewInit, OnInit, OnDestroy {
    public readonly appRoutes = AppRoutes;

    public containers$: Observable<IContainerWithItemsAmount[]> = combineLatest([this.store.select(containersSelector), this.store.select(itemsSelector)]).pipe(
        map(([containers, items]) => {
            return containers?.map(container => ({
                ...container,
                itemsAmount: items?.filter(item => item.containerId === container.id)?.length || 0
            }));
        })
    );

    public dataSource = new MatTableDataSource<IContainerWithItemsAmount>([]);

    @ViewChild(MatSort)
    private sort: MatSort;

    private subscription: Subscription;

    constructor(private store: Store, private dialog: Dialog) {
    }

    public ngOnInit(): void {
        this.store.dispatch(containersActions.loadContainersFromApi());
        this.store.dispatch(itemsActions.loadItemsFromApi());
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

    public ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }
}

