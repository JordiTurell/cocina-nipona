import { Routes } from "@angular/router";
import { Page403 } from "./pages/page-403/page-403";
import { Page404 } from "./pages/page-404/page-404";
import { Page500 } from "./pages/page-500/page-500";

export const routes: Routes = [
    
    { path: '403', component: Page403 },
    { path: '404', component: Page404 },
    { path: '500', component: Page500 },
];