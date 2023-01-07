import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, debounceTime, map, Subscription, tap } from 'rxjs';
import { IItem, itemsActions, itemsSelector } from '../reducers/items';
import { AppRoutes } from '../routes/app.routes';
import { ItemDeleteComponent } from './item-delete/item-delete.component';

@Component({
    selector: 'rdb-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy, AfterViewInit {
    public readonly appRoutes = AppRoutes;

    public searchValue$ = new BehaviorSubject<string>('');
    public items$ = this.store.select(itemsSelector);
    public filteredItems$ = combineLatest([this.searchValue$.pipe(debounceTime(250)), this.items$]).pipe(
        map(([searchValue, items]) => items.filter(item => item?.name?.toLowerCase()?.includes(searchValue?.toLowerCase() || '')))
    );

    public dataSource = new MatTableDataSource<IItem>([]);

    private subscription: Subscription;

    constructor(private store: Store, private dialog: Dialog, private cdRef: ChangeDetectorRef, private router: Router) {
    }

    public ngOnInit(): void {
        this.store.dispatch(itemsActions.loadItemsFromApi());
        this.subscription = this.filteredItems$.pipe(
            tap(filteredItems => {
                this.dataSource.data = filteredItems;
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
        this.cdRef.detectChanges();
    }
}
