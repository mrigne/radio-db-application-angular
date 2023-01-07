import jwtDecode, { JwtPayload } from 'jwt-decode';

export enum JwtClaims {
    name = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
}

export interface IJwtTokenParsed extends JwtPayload {
    [JwtClaims.name]: string;
}

export class JwtHelper {
    public static decodeJwt(token: string): IJwtTokenParsed {
        if (!token) {
            return undefined;
        }
        return jwtDecode<IJwtTokenParsed>(token);
    }

    public static getExpiryDate(token: string): Date {
        const decodedToken = JwtHelper.decodeJwt(token);
        if (!decodedToken?.exp) {
            return undefined;
        }
        return new Date(decodedToken.exp * 1000);
    }

    public static getUserName(token: string): string {
        return JwtHelper.decodeJwt(token)?.[JwtClaims.name];
    }
}
