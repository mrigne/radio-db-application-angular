import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'rdb-content-with-sidenav',
    templateUrl: './content-with-sidenav.component.html'
})
export class ContentWithSidenavComponent implements AfterViewInit {
    @Input()
    public routeForClose: string;

    constructor(private router: Router, private location: Location, private cdRef: ChangeDetectorRef) {
    }

    public onSideNavClose(): void {
        if (this.routeForClose) {
            this.router.navigateByUrl(this.routeForClose);
            return;
        }
        this.location.back();
    }

    public ngAfterViewInit(): void {
        this.cdRef.detectChanges();
    }
}
