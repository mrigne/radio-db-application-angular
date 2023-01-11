import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription, take, tap } from 'rxjs';
import { SubscriptionsHelper } from '../../../../helpers/subscriptions.helper';
import { routerSelectors } from '../../../routes/router.selectors';

@Component({
    selector: 'rdb-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit, OnDestroy {
    @ViewChild('searchInput', { static: false })
    public searchInput: ElementRef;

    @Input()
    public queryParamName: string;

    @Input()
    public goBackToSearchAndSelectAllOnFocusOutByTabKey = false;

    @Input()
    public label: string;

    @Input()
    public placeholder: string;

    @Output()
    public searchValue = new EventEmitter<string>();

    @Output()
    public searchFocusOut = new EventEmitter();

    public enteredValue$ = new BehaviorSubject<string>('');

    private subscriptions: Subscription[] = [];

    constructor(private router: Router, private store: Store) {
    }

    public onInput(event: Event): void {
        this.enteredValue$.next((event.target as HTMLInputElement).value);
    }

    public focus(): void {
        this.searchInput.nativeElement.focus();
    }

    public setValue(value: string): void {
        this.searchInput.nativeElement.value = value;
        this.searchValue.emit(value);
    }

    public selectAll(): void {
        (this.searchInput.nativeElement as HTMLInputElement).select();
    }

    public onFocusOut(event: Event): void {
        if (this.goBackToSearchAndSelectAllOnFocusOutByTabKey) {
            event.preventDefault();
            event.stopPropagation();
            this.selectAll();
        }
    }

    public ngAfterViewInit(): void {
        if (this.queryParamName) {
            this.store.select(routerSelectors.selectQueryParam(this.queryParamName)).pipe(
                distinctUntilChanged(),
                take(1),
                tap(queryParamsValueFromRoute => {
                    if (queryParamsValueFromRoute) {
                        this.setValue(queryParamsValueFromRoute);
                        this.enteredValue$.next(queryParamsValueFromRoute);
                    }
                })
            ).subscribe();
        }
        this.subscriptions.push(
            this.enteredValue$.pipe(
                debounceTime(250),
                distinctUntilChanged()
            ).subscribe(enteredValue => {
                if (this.store)
                if (this.queryParamName) {
                    this.router.navigate(['.'], {
                        queryParams: {
                            [this.queryParamName]: enteredValue || undefined
                        },
                        queryParamsHandling: 'merge'
                    });
                }
                if (this.searchValue.observed) {
                    this.searchValue.emit(enteredValue);
                }
            })
        );
    }

    public ngOnDestroy(): void {
        SubscriptionsHelper.unsubscribeFromAll(this.subscriptions);
    }
}
