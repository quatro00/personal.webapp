import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { admin_MatriculasExcluidasService } from
    'app/services/admin/admin_matriculas_excluidas.service';

import { AlertService } from 'app/services/alert.service';

import {
    MatriculaExcluida,
    GuardarMatriculaExcluida,
    OrganizacionResumen
} from 'models/matriculas-excluidas.model';

interface MatriculaExcluidaDialogData {
    item?: MatriculaExcluida | null;
    organizaciones: OrganizacionResumen[];
    organizacionId?: string;
}

@Component({
    selector: 'app-matricula-excluida-form',
    standalone: true,
    templateUrl: './matricula-excluida-form.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatProgressSpinnerModule
    ]
})
export class MatriculaExcluidaFormComponent {

    form: FormGroup;

    isEditMode: boolean = false;
    isLoading: boolean = false;

    organizaciones: OrganizacionResumen[] = [];

    constructor(
        private fb: FormBuilder,

        private dialogRef:
            MatDialogRef<MatriculaExcluidaFormComponent>,

        private matriculasService:
            admin_MatriculasExcluidasService,

        private alertService: AlertService,

        @Inject(MAT_DIALOG_DATA)
        public data: MatriculaExcluidaDialogData
    ) {

        this.isEditMode = !!data?.item?.id;

        this.organizaciones = data?.organizaciones || [];

        this.form = this.fb.nonNullable.group({

            organizacionId: [
                data?.item?.organizacionId ||
                data?.organizacionId || '',
                Validators.required
            ],

            matricula: [
                data?.item?.matricula || '',
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern(/\S/)
                ]
            ],

            nombre: [
                data?.item?.nombre || '',
                [
                    Validators.required,
                    Validators.maxLength(250),
                    Validators.pattern(/\S/)
                ]
            ],

            categoria: [
                data?.item?.categoria || '',
                [
                    Validators.required,
                    Validators.maxLength(150),
                    Validators.pattern(/\S/)
                ]
            ]
        });
    }

    save(): void {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.isLoading) {
            return;
        }

        const values = this.form.getRawValue();

        const request: GuardarMatriculaExcluida = {
            organizacionId: values.organizacionId,
            matricula: values.matricula.trim(),
            nombre: values.nombre.trim(),
            categoria: values.categoria.trim()
        };

        this.isLoading = true;

        const operation = this.isEditMode
            ? this.matriculasService.Update(
                this.data.item!.id,
                request
            )
            : this.matriculasService.Crear(request);

        operation
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({

                next: () => {
                    this.dialogRef.close(true);
                },

                error: (err: HttpErrorResponse) => {

                    const mensaje =
                        typeof err.error === 'string'
                            ? err.error
                            : err.error?.message ||
                              err.error?.title ||
                              'No fue posible guardar la matrícula.';

                    this.alertService.showError(
                        'Error',
                        mensaje
                    );
                }
            });
    }

    cancel(): void {

        if (this.isLoading) {
            return;
        }

        this.dialogRef.close(false);
    }
}