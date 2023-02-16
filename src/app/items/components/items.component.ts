import { Dialog } from '@angular/cdk/dialog';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, map, Observable, Subscription, tap } from 'rxjs';
import { containersActions, containersCollectionByIdSelector, IContainer } from '../../reducers/containers';
import { IItem, itemsActions, itemsSelector } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';
import { routerSelectors } from '../../routes/router.selectors';
import { ItemDeleteComponent } from '../item-delete/item-delete.component';

export interface IItemWithContainer extends IItem {
    container: IContainer;
}

@Component({
    selector: 'rdb-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent implements OnInit, OnDestroy, AfterViewInit {
    public readonly appRoutes = AppRoutes;
    public readonly searchQueryParam = 'search';

    public searchValue$ = this.store.select(routerSelectors.selectQueryParam(this.searchQueryParam)).pipe(
        distinctUntilChanged()
    );
    public containersById$ = this.store.select(containersCollectionByIdSelector);
    public items$: Observable<IItemWithContainer[]> = combineLatest([this.store.select(itemsSelector), this.containersById$]).pipe(
        map(([items, containersById]) => {
            return items?.map(item => ({
                ...item,
                container: containersById?.[item.containerId]
            }))
        })
    );
    public filteredItems$: Observable<IItemWithContainer[]> = combineLatest([this.searchValue$, this.items$]).pipe(
        map(([searchValue, items]) => items.filter(item => {
            const normalizedSearchValue = searchValue?.toLowerCase() || '';
            return item?.name?.toLowerCase()?.includes(normalizedSearchValue) ||
                item?.container?.name?.toLowerCase()?.includes(normalizedSearchValue) ||
                item?.container?.barcode === searchValue;
        }))
    );

    public dataSource = new MatTableDataSource<IItemWithContainer>([]);

    @ViewChild(MatSort)
    private sort: MatSort;

    private subscription: Subscription;

    constructor(private store: Store, private dialog: Dialog, private cdRef: ChangeDetectorRef, private router: Router) {
    }

    public ngOnInit(): void {
        this.store.dispatch(itemsActions.loadItemsFromApi());
        this.store.dispatch(containersActions.loadContainersFromApi());
        this.subscription = this.filteredItems$.pipe(
            tap(filteredItems => {
                this.dataSource.data = filteredItems;
                this.dataSource.sort = this.sort;
            })
        ).subscribe();
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onDelete(item: IItem): void {
        this.dialog.open(ItemDeleteComponent, {
            width: '30%',
            minWidth: '350px',
            data: item
        })
    }

    public ngAfterViewInit(): void {
        const defaultSortingDataAccessor = this.dataSource.sortingDataAccessor;
        this.dataSource.sortingDataAccessor = (data: IItemWithContainer, sortHeaderId: string): (string | number) => {
            if (sortHeaderId === 'container') {
                return data.container.name;
            }
            return defaultSortingDataAccessor(data, sortHeaderId);
        };
        this.dataSource.sort = this.sort;
        this.cdRef.detectChanges();
    }
}
