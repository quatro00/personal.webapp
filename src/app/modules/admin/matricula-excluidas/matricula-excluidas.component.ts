import { CommonModule } from '@angular/common';

import {
    Component,
    DestroyRef,
    OnInit,
    AfterViewInit,
    ViewChild,
    inject
} from '@angular/core';

import {
    FormControl,
    ReactiveFormsModule
} from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import {
    MatTableModule,
    MatTableDataSource
} from '@angular/material/table';

import {
    MatSort,
    MatSortModule
} from '@angular/material/sort';

import {
    MatPaginator,
    MatPaginatorModule
} from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { forkJoin, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { admin_MatriculasExcluidasService } from
    'app/services/admin/admin_matriculas_excluidas.service';

import { admin_OrganizacionService } from
    'app/services/admin/admin_organizacion.service';

import { AlertService } from 'app/services/alert.service';

import { FuseConfirmationService } from
    '@fuse/services/confirmation';


import {
    MatriculaExcluida,
    OrganizacionResumen
} from 'models/matriculas-excluidas.model';
import { MatriculaExcluidaFormComponent } from 'app/components/admin/matricula-excluida-form/matricula-excluida-form.component';

@Component({
  selector: 'app-matricula-excluidas',
  standalone: true,
  imports: [
    CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatProgressBarModule
  ],
  templateUrl: './matricula-excluidas.component.html',
  styleUrl: './matricula-excluidas.component.scss'
})
export class MatriculaExcluidasComponent implements OnInit, AfterViewInit {

    private readonly destroyRef = inject(DestroyRef);

    isLoading: boolean = false;

    organizaciones: OrganizacionResumen[] = [];

    // FILTROS
    searchInputControl = new FormControl('', {
        nonNullable: true
    });

    organizacionControl = new FormControl('', {
        nonNullable: true
    });

    // TABLA
    displayedColumns: string[] = [
        'organizacionNombre',
        'matricula',
        'nombre',
        'categoria',
        'activo',
        'acciones'
    ];

    dataSource = new MatTableDataSource<MatriculaExcluida>([]);

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private dialog: MatDialog,

        private matriculasService:
            admin_MatriculasExcluidasService,

        private organizacionService:
            admin_OrganizacionService,

        private alertService: AlertService,

        private confirmationService:
            FuseConfirmationService
    ) { }

    ngOnInit(): void {

        // CONFIGURAR BÚSQUEDA
        this.dataSource.filterPredicate = (data, filtro) => {

            const filtros = JSON.parse(filtro);

            const texto = filtros.texto;
            const organizacionId = filtros.organizacionId;

            const contenido = [
                data.matricula,
                data.nombre,
                data.categoria,
                data.organizacionNombre
            ]
            .join(' ')
            .toLowerCase();

            const coincideTexto =
                !texto || contenido.includes(texto);

            const coincideOrganizacion =
                !organizacionId ||
                data.organizacionId === organizacionId;

            return coincideTexto && coincideOrganizacion;
        };

        // BÚSQUEDA POR TEXTO
        this.searchInputControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.aplicarFiltros();
            });

        // FILTRO DE ORGANIZACIÓN
        this.organizacionControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.aplicarFiltros();
            });

        this.loadData();
    }

    ngAfterViewInit(): void {

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    // =====================================================
    // CARGAR INFORMACIÓN
    // =====================================================
    loadData(): void {

        this.isLoading = true;

        forkJoin({

            organizaciones:
                this.organizacionService.GetAll(),

            matriculas:
                this.matriculasService.GetAll()

        })
        .pipe(
            finalize(() => {
                this.isLoading = false;
            })
        )
        .subscribe({

            next: (response) => {

                this.organizaciones = response.organizaciones;

                this.dataSource.data = response.matriculas;

                this.aplicarFiltros();
            },

            error: (err: HttpErrorResponse) => {

                this.alertService.showError(
                    'Error',
                    this.obtenerMensajeError(err)
                );
            }
        });
    }

    // =====================================================
    // APLICAR FILTROS
    // =====================================================
    aplicarFiltros(): void {

        const filtro = {

            texto:
                this.searchInputControl.value
                    .trim()
                    .toLowerCase(),

            organizacionId:
                this.organizacionControl.value
        };

        this.dataSource.filter = JSON.stringify(filtro);

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    // =====================================================
    // REGISTRAR MATRÍCULA
    // =====================================================
    nuevo(): void {

        this.abrirFormulario();
    }

    // =====================================================
    // EDITAR MATRÍCULA
    // =====================================================
    editar(item: MatriculaExcluida): void {

        this.abrirFormulario(item);
    }

    // =====================================================
    // ABRIR FORMULARIO
    // =====================================================
    abrirFormulario(item?: MatriculaExcluida): void {

        const dialogRef = this.dialog.open(
            MatriculaExcluidaFormComponent,
            {
                width: '550px',
                maxWidth: '95vw',
                disableClose: true,

                data: {
                    item: item || null,
                    organizaciones: this.organizaciones,
                    organizacionId:
                        this.organizacionControl.value
                }
            }
        );

        dialogRef.afterClosed().subscribe(result => {

            if (result) {

                this.alertService.showSuccess(
                    'Matrículas excluidas',
                    item
                        ? 'Matrícula actualizada correctamente.'
                        : 'Matrícula registrada correctamente.'
                );

                this.loadData();
            }
        });
    }

    // =====================================================
    // ACTIVAR / DESACTIVAR
    // =====================================================
    cambiarEstatus(item: MatriculaExcluida): void {

        const activar = !item.activo;

        const dialogRef = this.confirmationService.open({

            title: activar
                ? 'Activar exclusión'
                : 'Desactivar exclusión',

            message: activar
                ? 'Las incidencias de esta matrícula dejarán de mostrarse al delegado sindical de su organización.'
                : 'Las incidencias de esta matrícula volverán a mostrarse al delegado sindical de su organización.',

            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn'
            },

            actions: {
                confirm: {
                    show: true,
                    label: activar ? 'Activar' : 'Desactivar',
                    color: activar ? 'primary' : 'warn'
                },
                cancel: {
                    show: true,
                    label: 'Cancelar'
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result !== 'confirmed') {
                return;
            }

            this.isLoading = true;

            const operation = activar
                ? this.matriculasService.Reactivar(item.id)
                : this.matriculasService.Desactivar(item.id);

            operation
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe({

                    next: () => {

                        this.alertService.showSuccess(
                            'Matrículas excluidas',
                            activar
                                ? 'Matrícula activada correctamente.'
                                : 'Matrícula desactivada correctamente.'
                        );

                        this.loadData();
                    },

                    error: (err: HttpErrorResponse) => {

                        this.alertService.showError(
                            'Error',
                            this.obtenerMensajeError(err)
                        );
                    }
                });
        });
    }

    // =====================================================
    // MENSAJES DE ERROR
    // =====================================================
    private obtenerMensajeError(
        err: HttpErrorResponse
    ): string {

        if (typeof err.error === 'string') {
            return err.error;
        }

        return err.error?.message ||
               err.error?.title ||
               'Ocurrió un error inesperado.';
    }

}
