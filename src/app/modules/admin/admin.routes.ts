import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from 'app/layout/layout.component';

export default [
    {
        path: '',
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'example', component: ExampleComponent },
        ]
    },
] as Routes;
