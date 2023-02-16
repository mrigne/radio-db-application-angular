import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ComponentInputHelper } from '../../../../helpers/component-input.helper';

@Component({
    selector: 'rdb-content-with-sidenav',
    templateUrl: './content-with-sidenav.component.html',
    styleUrls: ['./content-with-sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentWithSidenavComponent {
    public routeForClose$ = new BehaviorSubject<string>(null);
    public preserveQueryParams$ = new BehaviorSubject<boolean>(true);
    public sidenavOutletActivated$ = new BehaviorSubject<boolean>(false);

    @Input()
    public set routeForClose(routeForClose: string) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.routeForClose$, routeForClose);
    }

    @Input()
    public set preserveQueryParams(preserveQueryParams: boolean) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.preserveQueryParams$, preserveQueryParams, true)
    }

    constructor(private router: Router, private location: Location, private cdRef: ChangeDetectorRef) {
    }

    public onSideNavClose(): void {
        if (this.routeForClose$.value) {
            this.router.navigate([this.routeForClose$.value], {
                queryParamsHandling: this.preserveQueryParams$.value ? 'preserve' : null
            })
        } else {
            this.location.back();
        }
    }
}
