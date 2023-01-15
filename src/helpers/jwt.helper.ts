import jwtDecode, { JwtPayload } from 'jwt-decode';
import { isNil } from 'lodash';

export enum JwtClaims {
    name = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
}

export interface IJwtTokenParsed extends JwtPayload {
    username: string;
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

    public static isTokenExpired(token: string, offsetMillis?: number): boolean {
        if (!token) {
            return !!token;
        }
        const currentDate = new Date();
        if (!isNil(offsetMillis)) {
            currentDate.setMilliseconds(currentDate.getMilliseconds() - offsetMillis);
        }
        return JwtHelper.getExpiryDate(token) < currentDate;
    }

    public static getUserName(token: string): string {
        return JwtHelper.decodeJwt(token)?.username;
    }
}
