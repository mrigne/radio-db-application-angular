import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isNil } from 'lodash';
import { filter, map, startWith, Subscription, switchMap, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { SubscriptionsHelper } from '../../../helpers/subscriptions.helper';
import { getErrorMessageByError } from '../../../helpers/validation-error-message.helper';
import { containerByIdSelector, containersActions, containersSelector } from '../../reducers/containers';
import { IItem, itemsActions, itemsSelector, itemsSelectorById } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';

@Component({
    selector: 'rdb-item-add-new',
    templateUrl: './item-add-new.component.html',
    styleUrls: ['./item-add-new.component.scss']
})
export class ItemAddNewComponent implements OnInit, OnDestroy {
    public readonly getErrorMessageByError = getErrorMessageByError;

    @ViewChild('containerSelect', { static: false })
    public containerSelect: MatSelect;

    public form = this.fb.group<{
        name: FormControl<string>,
        count: FormControl<number>,
        containerBarcode: FormControl<string>,
        containerId: FormControl<string>
    }>({
        name: new FormControl<string>('', [Validators.required]),
        count: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
        containerBarcode: new FormControl<string>(''),
        containerId: new FormControl<string>('', [Validators.required])
    });

    public containers$ = this.store.select(containersSelector);

    private subscriptions: Subscription[] = [];

    constructor(private store: Store,
                private fb: FormBuilder,
                private snackbarService: SnackbarService,
                private router: Router
    ) {
    }

    public ngOnInit(): void {
        this.store.dispatch(containersActions.loadContainersFromApi());
        this.subscriptions.push(
            this.form.controls.containerBarcode.valueChanges.pipe(
                startWith(this.form.controls.containerBarcode.value),
                switchMap(containerBarcode => {
                    return this.containers$.pipe(
                        tap(containers => {
                            const containerWithEnteredBarcode = containers?.find(container => container?.barcode === containerBarcode)
                            if (containerWithEnteredBarcode) {
                                this.containerSelect.value = containerWithEnteredBarcode.id;
                            }
                        })
                    );
                })
            ).subscribe()
        );
    }

    public onAddNewItem(): void {
        this.store.select(itemsSelector).pipe(
            filter(items => !isNil(items?.length)),
            take(1),
            map(items => items?.length),
            switchMap(itemsCount => {
                return this.store.select(itemsSelector).pipe(
                    map(items => items?.length),
                    filter(newItemsCount => newItemsCount === itemsCount + 1),
                    take(1),
                    tap(() => {
                        this.snackbarService.showSuccessSnackbar('Item successfully added');
                        this.router.navigateByUrl(AppRoutes.items.full());
                    })
                );
            })
        ).subscribe();
        this.store.dispatch(itemsActions.createNewItem({
            newItem: {
                ...this.form.value
            } as IItem
        }));
    }

    public ngOnDestroy(): void {
        SubscriptionsHelper.unsubscribeFromAll(this.subscriptions);
    }
}
