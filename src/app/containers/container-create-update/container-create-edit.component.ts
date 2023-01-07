import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEqual, omit } from 'lodash';
import {
    combineLatest,
    distinctUntilChanged,
    filter,
    shareReplay,
    startWith,
    Subscription,
    switchMap,
    take,
    tap
} from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { SubscriptionsHelper } from '../../../helpers/subscriptions.helper';
import { getErrorMessageByError } from '../../../helpers/validation-error-message.helper';
import { containerByIdSelector, containersActions, containersSelector, IContainer } from '../../reducers/containers';
import { itemsSelectorById } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';
import { RouteParams } from '../../routes/route.params';
import { routerSelectors } from '../../routes/router.selectors';
import { ContainersService } from '../../state/containers/containers.service';

@Component({
    selector: 'rdb-container-create',
    templateUrl: './container-create-edit.component.html'
})
export class ContainerCreateEditComponent implements OnInit, OnDestroy {
    public readonly getErrorMessageByError = getErrorMessageByError;

    public form = this.fb.group<{
        name: FormControl<string>,
        barcode: FormControl<string>
    }>({
        name: new FormControl<string>('', Validators.required),
        barcode: new FormControl<string>('', Validators.required)
    });

    public container$ = this.store.select(routerSelectors.selectRouteParam(RouteParams.containerId)).pipe(
        distinctUntilChanged(),
        switchMap(containerId => {
            return this.store.select(containerByIdSelector(containerId));
        }),
        shareReplay({
            bufferSize: 1,
            refCount: true
        })
    );

    public containers$ = this.store.select(containersSelector).pipe(
        distinctUntilChanged(isEqual),
        shareReplay({
            bufferSize: 1,
            refCount: true
        })
    );

    private subscriptions: Subscription[] = [];

    constructor(private containersService: ContainersService,
                private store: Store,
                private fb: FormBuilder,
                private snackbarService: SnackbarService,
                private router: Router
    ) {
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.container$.pipe(
                filter(Boolean),
                take(1),
                tap(container => {
                    this.form.setValue(omit(container, 'id', 'userId'));
                })
            ).subscribe(),
            combineLatest([this.form.controls.barcode.valueChanges.pipe(startWith(this.form.controls.barcode.value), distinctUntilChanged()), this.containers$]).pipe(
                tap(([barcode, containers]) => {
                    const containerWithEnteredBarcode = containers?.find(container => container?.barcode === barcode)
                    if (containerWithEnteredBarcode) {
                        this.form.controls.barcode.setErrors({
                            barcode: true
                        });
                    } else {
                        if (this.form.controls.barcode.hasError('barcode')) {
                            this.form.controls.barcode.setErrors({
                                ...omit(this.form.controls.barcode.errors || {}, 'barcode')
                            });
                        }
                    }
                })
            ).subscribe()
        );
    }

    public onCreateContainer(): void {
        this.store.select(containersSelector).pipe(
            filter(containers => containers?.some(container => container.barcode === this.form.controls.barcode.value)),
            take(1),
            tap(() => {
                this.snackbarService.showSuccessSnackbar('Container successfully added');
                this.router.navigateByUrl(AppRoutes.containers.full());
            })
        ).subscribe();
        this.store.dispatch(containersActions.createNewContainer({
            newContainer: {
                ...this.form.value
            } as IContainer
        }));
    }

    public onUpdateContainer(): void {
        this.container$.pipe(
            take(1),
            tap(container => {
                const updatedContainer = {
                    ...container,
                    ...this.form.value
                };
                this.container$.pipe(
                    filter(newContainerFromStore => isEqual(newContainerFromStore, updatedContainer)),
                    take(1),
                    tap(() => {
                        this.snackbarService.showSuccessSnackbar('Container successfully updated');
                        this.router.navigateByUrl(AppRoutes.containers.full());
                    })
                ).subscribe();
                this.store.dispatch(containersActions.updateContainerById({ newContainer: updatedContainer }));
            })
        ).subscribe();
    }

    public ngOnDestroy(): void {
        SubscriptionsHelper.unsubscribeFromAll(this.subscriptions);
    }
}
