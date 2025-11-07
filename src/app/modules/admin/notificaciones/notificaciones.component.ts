import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { admin_NotificacionService } from 'app/services/admin/admin_notificacion.service';
import { admin_OrganizacionService } from 'app/services/admin/admin_organizacion.service';
import { AlertService } from 'app/services/alert.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatFormField,
    MatLabel,
    MatTableModule,
    FuseCardComponent,
    MatDialogActions,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatIcon,
    MatTooltipModule,
    MatButton,
    MatInputModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent {
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;

  filtroTexto: string = '';
  filtroOrganizacion: string = '';

  organizaciones: any[] = [];
  notificaciones: any[] = [];

  columnas: string[] = ['quincena', 'matricula', 'nombre', 'detalle'];
  detalleColumnas: string[] = ['fecha', 'concepto', 'descripcion', 'incEnt', 'incSal'];

  expandedRow: any = null;

  organizacionControl = new FormControl('0');
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private dialog: MatDialog,
    private admin_OrganizacionService: admin_OrganizacionService,
    private alertService: AlertService,
    private admin_NotificacionService: admin_NotificacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dataSource.data = [];
    forkJoin([this.admin_OrganizacionService.GetAll()]).subscribe({
      next: ([organizacionResponse]) => {
        this.organizaciones = organizacionResponse;
      },
      complete: () => { },
      error: () => {
        this.alertService.showError('Error', 'Ocurrió un error inesperado.');
      }
    });
  }

  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  isDetailRow = (_: any, row: any) => row === this.expandedRow;

  filteredTickets() {
    return this.notificaciones.filter(ticket => {
      const texto = this.filtroTexto.toLowerCase();
      return (
        (!this.filtroOrganizacion || ticket.organizacionId === this.filtroOrganizacion) &&
        (
          ticket.quincena.toLowerCase().includes(texto) ||
          ticket.matricula.toLowerCase().includes(texto) ||
          ticket.nombre.toLowerCase().includes(texto) ||
          ticket.fecha.toLowerCase().includes(texto) ||
          ticket.concepto.toLowerCase().includes(texto) ||
          ticket.descripcion.toLowerCase().includes(texto) ||
          ticket.incEnt.toLowerCase().includes(texto) ||
          ticket.incSal.toLowerCase().includes(texto) ||
          ticket.notificacion.toLowerCase().includes(texto)
        )
      );
    });
  }

  buscarNotificaciones() {

    this.isLoading = true;
    console.log(this.organizacionControl.value);
    if (this.organizacionControl.value == '0') { return; }

    this.admin_NotificacionService.CalcularNotificaciones({ organizacionId: this.organizacionControl.value }).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.alertService.showError('Error', err.error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  enviarCorreos(){
    
  }
}
