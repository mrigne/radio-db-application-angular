import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    filter,
    Subject,
    Subscription,
    switchMap,
    take,
    tap
} from 'rxjs';
import { ComponentInputHelper } from '../../../../helpers/component-input.helper';
import { SubscriptionsHelper } from '../../../../helpers/subscriptions.helper';
import { routerSelectors } from '../../../routes/router.selectors';

@Component({
    selector: 'rdb-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements AfterViewInit, OnDestroy {
    public queryParamName$ = new BehaviorSubject<string>(null);
    public goBackToSearchAndSelectAllOnFocusOutByTabKey$ = new BehaviorSubject<boolean>(false);
    public label$ = new BehaviorSubject<string>(null);
    public placeholder$ = new BehaviorSubject<string>(null);

    @ViewChild('searchInput', { static: false })
    public searchInput: ElementRef;

    @Input()
    public set queryParamName(queryParamName: string) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.queryParamName$, queryParamName);
    }

    @Input()
    public set goBackToSearchAndSelectAllOnFocusOutByTabKey(goBackToSearchAndSelectAllOnFocusOutByTabKey: boolean) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.goBackToSearchAndSelectAllOnFocusOutByTabKey$, goBackToSearchAndSelectAllOnFocusOutByTabKey, false);
    };

    @Input()
    public set label(label: string) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.label$, label);
    }

    @Input()
    public set placeholder(placeholder: string) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.placeholder$, placeholder);
    }

    @Output()
    public searchValue = new EventEmitter<string>();

    @Output()
    public searchFocusOut = new EventEmitter();

    public enteredValue$ = new Subject<string>();

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
        if (this.goBackToSearchAndSelectAllOnFocusOutByTabKey$.value) {
            event.preventDefault();
            event.stopPropagation();
            this.selectAll();
        }
    }

    public ngAfterViewInit(): void {
        this.queryParamName$.pipe(
            filter(Boolean),
            take(1),
            switchMap(queryParamName => {
                return this.store.select(routerSelectors.selectQueryParam(queryParamName)).pipe(
                    distinctUntilChanged(),
                    take(1),
                    tap(queryParamsValueFromRoute => {
                        if (queryParamsValueFromRoute) {
                            this.setValue(queryParamsValueFromRoute);
                            this.enteredValue$.next(queryParamsValueFromRoute);
                        }
                    })
                )
            })
        ).subscribe();
        this.subscriptions.push(
            this.enteredValue$.pipe(
                debounceTime(250),
                distinctUntilChanged(),
                switchMap(enteredValue => {
                    return this.queryParamName$.pipe(
                        tap(queryParamName => {
                            if (queryParamName) {
                                this.router.navigate(['.'], {
                                    queryParams: {
                                        [queryParamName]: enteredValue || undefined
                                    },
                                    queryParamsHandling: 'merge'
                                });
                            }
                            if (this.searchValue.observed) {
                                this.searchValue.emit(enteredValue);
                            }
                        })
                    )
                })
            ).subscribe()
        );
    }

    public ngOnDestroy(): void {
        SubscriptionsHelper.unsubscribeFromAll(this.subscriptions);
    }
}
