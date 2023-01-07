import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { handleErrors } from '../../../helpers/operators/handle-auth-error.operator';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { containersActions } from '../../reducers/containers';
import { ContainersService } from './containers.service';

@Injectable()
export class ContainersEffects {
    public loadContainers$ = createEffect(() => this.actions$.pipe(
            ofType(containersActions.loadContainersFromApi),
            switchMap(() => this.containersService.loadContainers().pipe(
                map(containers => containersActions.receivedContainers({ containers })),
                handleErrors(this.router, this.snackbarService)
            ))
        )
    );

    public createNewContainer$ = createEffect(() => this.actions$.pipe(
            ofType(containersActions.createNewContainer),
            switchMap(createNewContainerAction => this.containersService.createContainer(createNewContainerAction.newContainer).pipe(
                map(() => containersActions.loadContainersFromApi()),
                handleErrors(this.router, this.snackbarService)
            ))
        )
    );

    public updateContainer$ = createEffect(() => this.actions$.pipe(
            ofType(containersActions.updateContainerById),
            switchMap(updateContainerByIdAction => this.containersService.updateContainer(updateContainerByIdAction.newContainer).pipe(
                map(() => containersActions.loadContainersFromApi()),
                handleErrors(this.router, this.snackbarService)
            ))
        )
    );

    public deleteContainer$ = createEffect(() => this.actions$.pipe(
            ofType(containersActions.deleteContainerById),
            switchMap(deleteContainerByIdAction => this.containersService.deleteContainer(deleteContainerByIdAction.containerId).pipe(
                map(() => containersActions.loadContainersFromApi()),
                handleErrors(this.router, this.snackbarService)
            ))
        )
    );

    constructor(private actions$: Actions, private containersService: ContainersService, private router: Router, private snackbarService: SnackbarService) {
    }
}
