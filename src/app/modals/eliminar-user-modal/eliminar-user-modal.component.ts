import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdministradorService } from 'src/app/services/administrador.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
@Component({
  selector: 'app-eliminar-user-modal',
  templateUrl: './eliminar-user-modal.component.html',
  styleUrls: ['./eliminar-user-modal.component.scss']
})
export class EliminarUserModalComponent implements OnInit {

  public rol: string = "";

  constructor(
    private administradoresService: AdministradorService,
    private alumnosService: AlumnosService,
    private maestrosService: MaestrosService,
    public dialogRef: MatDialogRef<EliminarUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(){
   this.dialogRef.close({isDeleted: false});
  }

  public eliminarUser(){
    if(this.rol=="administrador"){
      this.administradoresService.eliminarAdmin(this.data.id).subscribe(
        (response)=>{
          console.log("Admin eliminado");
          this.dialogRef.close({isDeleted: true});
        }, (error)=>{
          this.dialogRef.close({isDeleted: false});
        }
      );
    }else if(this.rol=="maestro"){
      this.maestrosService.eliminarMaestro(this.data.id).subscribe(
        (response)=>{
          console.log("Maestro eliminado");
          this.dialogRef.close({isDeleted: true});
        }, (error)=>{
          this.dialogRef.close({isDeleted: false});
        }
      );
    }else if(this.rol=="alumno"){
      this.alumnosService.eliminarAlumno(this.data.id).subscribe(
        (response)=>{
          console.log("Alumno eliminado");
          this.dialogRef.close({isDeleted: true});
        }, (error)=>{
          this.dialogRef.close({isDeleted: false});
        }
      );
    }
  }
}
