import { Component } from '@angular/core';
import { JwtHelper } from '../../helpers/jwt.helper';
import { AppRoutes } from '../routes/app.routes';
import { AUTH_LOCAL_STORAGE_NAME } from '../state/auth/auth.service';

@Component({
    selector: 'rdb-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    public readonly appRoutes = AppRoutes;

    public userName = JwtHelper.getUserName(localStorage.getItem(AUTH_LOCAL_STORAGE_NAME));
}
