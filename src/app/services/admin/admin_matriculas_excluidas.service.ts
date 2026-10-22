import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../enviroments/environment';

import {
    MatriculaExcluida,
    GuardarMatriculaExcluida
} from 'models/matriculas-excluidas.model';

@Injectable({
    providedIn: 'root'
})
export class admin_MatriculasExcluidasService {

    service: string = 'administrador/MatriculasExcluidas';

    constructor(
        private http: HttpClient
    ) { }

    // Consultar todas o filtrar por organización
    GetAll(organizacionId?: string): Observable<MatriculaExcluida[]> {

        let params = new HttpParams();

        if (organizacionId) {
            params = params.set('organizacionId', organizacionId);
        }

        return this.http.get<MatriculaExcluida[]>(
            `${environment.apiUrl}/${this.service}`,
            { params }
        );
    }

    // Consultar por ID
    GetById(id: string): Observable<MatriculaExcluida> {

        return this.http.get<MatriculaExcluida>(
            `${environment.apiUrl}/${this.service}/${id}`
        );
    }

    // Registrar matrícula
    Crear(request: GuardarMatriculaExcluida): Observable<any> {

        return this.http.post<any>(
            `${environment.apiUrl}/${this.service}`,
            request
        );
    }

    // Actualizar matrícula
    Update(
        id: string,
        request: GuardarMatriculaExcluida
    ): Observable<void> {

        return this.http.put<void>(
            `${environment.apiUrl}/${this.service}/${id}`,
            request
        );
    }

    // Activar matrícula
    Reactivar(id: string): Observable<void> {

        return this.http.put<void>(
            `${environment.apiUrl}/${this.service}/${id}/activar`,
            {}
        );
    }

    // Desactivar matrícula
    Desactivar(id: string): Observable<void> {

        return this.http.put<void>(
            `${environment.apiUrl}/${this.service}/${id}/desactivar`,
            {}
        );
    }
}