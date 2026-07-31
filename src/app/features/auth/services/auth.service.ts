import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticateResponse, LoginRequest, LoginResponseData } from '../interfaces';
import { map, Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';
import { ApiResponse } from '@/app/core/models';
import { deleteCookie, getCookie, setCookie } from '@/app/core/utils/cookie.util';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _baseUrl = `${environment.apiUrl}/auth`;
    private readonly token = 'token';
    private readonly refreshToken = 'refresh_token';
    private readonly tokenType = 'token_type';
    private readonly expiresIn = 'expires_in';

    constructor(private readonly _http: HttpClient) {}

    login(payload: LoginRequest): Observable<LoginResponseData> {
        return this._http.post<ApiResponse<LoginResponseData>>(`${this._baseUrl}/login`, payload).pipe(
            map((res) => res.data),
            tap((data) => this.saveSessionToCookies(data))
        );
    }

    authenticate(): Observable<AuthenticateResponse> {
        return this._http.get<ApiResponse<AuthenticateResponse>>(`${this._baseUrl}/authenticate`).pipe(map((res) => res.data));
    }

    logout(): void {
        deleteCookie(this.token);
        deleteCookie(this.refreshToken);
        deleteCookie(this.tokenType);
        deleteCookie(this.expiresIn);
    }

    // ---------- GETTERS ----------
    getToken(): string | null {
        return getCookie(this.token);
    }

    getTokenType(): string | null {
        return getCookie(this.tokenType);
    }

    getRefreshToken(): string | null {
        return getCookie(this.refreshToken);
    }

    getExpiresIn(): number | null {
        const v = getCookie(this.expiresIn);
        if (!v) return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }

    // ------- PRIVATE
    private saveSessionToCookies(data: LoginResponseData): void {
        const maxAge = data.expiresIn;

        setCookie(this.token, data.token, maxAge);
        setCookie(this.refreshToken, data.refreshToken, maxAge);
        setCookie(this.tokenType, data.type ?? 'Bearer', maxAge);
        setCookie(this.expiresIn, String(data.expiresIn), maxAge);
    }
}
