import { Routes } from '@angular/router';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';


export const routes: Routes = [
    { path: '', redirectTo: '/catalogue', pathMatch: 'full' },
    {
        path: 'catalogue',
        component: CatalogueComponent
    }
    
];
