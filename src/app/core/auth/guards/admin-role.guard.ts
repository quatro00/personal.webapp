import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminRoleGuard: CanActivateFn = () => {

    const router = inject(Router);

    let roles: string[] = [];

    try {

        const userData = localStorage.getItem('user');

        if (userData) {

            const user = JSON.parse(userData);

            roles = Array.isArray(user.roles)
                ? user.roles
                : [];
        }

    } catch {

        roles = [];
    }

    if (roles.includes('Administrador')) {
        return true;
    }

    return router.parseUrl('/delegado/notificaciones');
};