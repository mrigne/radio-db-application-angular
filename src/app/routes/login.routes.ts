export class LoginRoutes {
    public static ROUTES_TREE = {
        login: {
            name: 'login',
            full: LoginRoutes.login
        }
    }

    public static login(): string {
        return `/${LoginRoutes.ROUTES_TREE.login.name}`;
    }
}
