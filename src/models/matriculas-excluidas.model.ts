export interface MatriculaExcluida {
    id: string;
    organizacionId: string;
    organizacionNombre: string;
    matricula: string;
    nombre: string;
    categoria: string;
    activo: boolean;
    fechaCreacion: string;
    usuarioCreacion: string;
    fechaModificacion?: string | null;
    usuarioModificacion?: string | null;
}

export interface GuardarMatriculaExcluida {
    organizacionId: string;
    matricula: string;
    nombre: string;
    categoria: string;
}

export interface OrganizacionResumen {
    id: string;
    nombre: string;
    activo: boolean;
}