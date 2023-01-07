import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, shareReplay, switchMap, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { getErrorMessageByError } from '../../../helpers/validation-error-message.helper';
import { containerByIdSelector, containersActions } from '../../reducers/containers';
import { itemsActions, itemsSelectorById } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';
import { RouteParams } from '../../routes/route.params';
import { routerSelectors } from '../../routes/router.selectors';

@Component({
    selector: 'rdb-item-add',
    templateUrl: './item-add.component.html',
    styleUrls: ['./item-add.component.scss']
})
export class ItemAddComponent implements OnInit {
    public readonly getErrorMessageByError = getErrorMessageByError;

    @ViewChild('countInput', { static: false })
    public countInput: ElementRef;

    public form = this.fb.group<{
        addCount: FormControl<number>
    }>({
        addCount: new FormControl<number>(1, [Validators.required, Validators.min(1)])
    });

    public item$ = this.store.select(routerSelectors.selectRouteParam(RouteParams.itemId)).pipe(
        distinctUntilChanged(),
        switchMap(itemId => {
            return this.store.select(itemsSelectorById(itemId));
        }),
        shareReplay({
            bufferSize: 1,
            refCount: true
        })
    );

    public container$ = this.item$.pipe(
        switchMap(item => {
            return this.store.select(containerByIdSelector(item?.containerId));
        })
    );

    constructor(private store: Store, private fb: FormBuilder, private router: Router, private snackbarService: SnackbarService) {
    }

    public ngOnInit(): void {
        this.store.dispatch(containersActions.loadContainersFromApi());
    }

    public onAdd(): void {
        this.item$.pipe(
            take(1),
            tap(item => {
                const newCount = item.count + this.form.value.addCount;

                this.store.select(itemsSelectorById(item?.id)).pipe(
                    filter(item => item.count === newCount),
                    take(1),
                    tap(() => {
                        this.snackbarService.showSuccessSnackbar(`${item?.name} successfully added. Added count: ${this.form.value.addCount}`);
                        this.router.navigateByUrl(AppRoutes.items.full());
                    })
                ).subscribe();

                this.store.dispatch(itemsActions.updateItemById({
                    newItem: {
                        ...item,
                        count: newCount
                    }
                }));
            })
        ).subscribe();
    }

    public onFocus(): void {
        this.countInput.nativeElement.select();
    }
}
