import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rdb-authorized-layout',
    templateUrl: './authorized-layout.component.html',
    styleUrls: ['./authorized-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizedLayoutComponent {
}
