import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { LayoutComponent } from 'app/layout/layout.component';
import { ReporteTrabajadorComponent } from 'app/modules/admin/reporte-trabajador/reporte-trabajador.component';
import { ReporteQuincenaComponent } from 'app/modules/admin/reporte-quincena/reporte-quincena.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { HomeComponent } from '../admin/home/home.component';

export default [
    {
        path: '',
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'notificaciones', component: NotificacionesComponent },
        ]
    },
] as Routes;
