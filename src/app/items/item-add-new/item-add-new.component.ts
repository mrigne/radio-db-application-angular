import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty, isNil, omit } from 'lodash';
import { filter, map, startWith, Subscription, switchMap, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { SubscriptionsHelper } from '../../../helpers/subscriptions.helper';
import { ValidationErrorMessageHelper } from '../../../helpers/validation-error-message.helper';
import { containersActions, containersSelector } from '../../reducers/containers';
import { IItem, itemsActions, itemsSelector } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';

export interface IAddNewItemForm {
    name: FormControl<string>;
    count: FormControl<number>;
    containerBarcode: FormControl<string>;
    containerId: FormControl<string>;
}

@Component({
    selector: 'rdb-item-add-new',
    templateUrl: './item-add-new.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemAddNewComponent implements OnInit, OnDestroy {
    @ViewChild('barcodeInput', { static: false })
    public barcodeInput: ElementRef<HTMLInputElement>;

    @ViewChild('containerSelect', { static: false })
    public containerSelect: MatSelect;

    @ViewChild('itemNameInput', { static: false })
    public itemNameInput: ElementRef<HTMLInputElement>;

    public form = this.fb.group<IAddNewItemForm>({
        name: new FormControl<string>('', [Validators.required]),
        count: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
        containerBarcode: new FormControl<string>(''),
        containerId: new FormControl<string>('', [Validators.required])
    });

    public containers$ = this.store.select(containersSelector);

    private subscriptions: Subscription[] = [];

    constructor(public validationErrorMessageHelper: ValidationErrorMessageHelper,
                private store: Store,
                private fb: FormBuilder,
                private snackbarService: SnackbarService,
                private router: Router,
                private cdRef: ChangeDetectorRef
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
            switchMap(itemsAmount => {
                return this.store.select(itemsSelector).pipe(
                    map(items => items?.length),
                    filter(newItemsAmount => newItemsAmount === itemsAmount + 1),
                    take(1),
                    tap(() => {
                        this.snackbarService.showSuccessSnackbar('items.createItem.snackBarMessages.successfullyAdded');
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

    public onTabPressedInBarcode(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        const enteredBarcode = (event.target as HTMLInputElement).value;
        if (enteredBarcode) {
            this.containers$.pipe(
                filter(Boolean),
                take(1),
                tap(containers => {
                    const containerWithEnteredBarcode = containers?.find(container => container.barcode === enteredBarcode);
                    if (!containerWithEnteredBarcode) {
                        this.form.controls.containerBarcode.setErrors({
                            ...this.form.controls.containerBarcode.errors || {},
                            containerWithEnteredBarcodeNotExist: true
                        });
                        this.barcodeInput.nativeElement.select();
                        this.form.controls.containerBarcode.markAsTouched();
                    } else {
                        if (this.form.controls.containerBarcode.hasError('containerWithEnteredBarcodeNotExist')) {
                            const errorWithoutContainerWithEnteredBarcodeNotExistError = omit(this.form.controls.containerBarcode.errors || {}, 'containerWithEnteredBarcodeNotExist');
                            this.form.controls.containerBarcode.setErrors(isEmpty(errorWithoutContainerWithEnteredBarcodeNotExistError) ? null : errorWithoutContainerWithEnteredBarcodeNotExistError);
                        }
                        this.itemNameInput.nativeElement.focus();
                    }
                    this.cdRef.detectChanges();
                })
            ).subscribe();
        }
    }
}
