import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-eliminar-materia-modal',
  templateUrl: './eliminar-materia-modal.component.html',
  styleUrls: ['./eliminar-materia-modal.component.scss']
})
export class EliminarMateriaModalComponent implements OnInit{


  constructor(
    private MateriasService: MateriasService,
    public dialogRef: MatDialogRef<EliminarMateriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
  }

  public cerrar_modal(){
   this.dialogRef.close({isDeleted: false});
  }

  public eliminarMateria(){
      this.MateriasService.eliminarMateria(this.data.id).subscribe(//Se le pasa el data del id de la materia para eliminarla, que fue mandada del componente MateriasScreen
        (response)=>{
          console.log("Materia eliminada");//Entra el response y manda a imprimir a consola que se realizo correctamente la eliminacion de la materia
          this.dialogRef.close({isDeleted: true});
        }, (error)=>{
          this.dialogRef.close({isDeleted: false});
        }
      );
  }
}
