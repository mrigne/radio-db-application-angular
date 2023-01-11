import { ContainersRoutes } from './containers.routes';
import { ItemsRoutes } from './items.routes';
import { LoginRoutes } from './login.routes';

export class AppRoutes {
    public static items = ItemsRoutes.ROUTES_TREE;
    public static containers = ContainersRoutes.ROUTES_TREE;
    public static login = LoginRoutes.ROUTES_TREE;

}
