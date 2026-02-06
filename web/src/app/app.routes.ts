import { Routes } from '@angular/router';
import { Auth } from './features/auth/pages/auth/auth';

export const routes: Routes = [
    { path: '', component: Auth },
    { path: 'error', loadChildren: () => import('./features/error/error.routes').then(m => m.routes) }
];
