// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.isTokenPresent()) {
            return true;
        } else {
            // Navigate to the login page if the token is not present
            this.router.navigate(['/login']);
            return false;
        }
    }

    private isTokenPresent(): boolean {
        // Check if the access token is present in local storage
        const accessToken = localStorage.getItem('accessToken');
        return !!accessToken;
    }
}
