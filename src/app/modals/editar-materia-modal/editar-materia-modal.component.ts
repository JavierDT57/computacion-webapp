import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MateriasService } from 'src/app/services/materias.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-materia-modal',
  templateUrl: './editar-materia-modal.component.html',
  styleUrls: ['./editar-materia-modal.component.scss']
})
export class EditarMateriaModalComponent implements OnInit {

  constructor(
    private MateriasService: MateriasService,
    public dialogRef: MatDialogRef<EditarMateriaModalComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
  }

  public cerrar_modal(){
   this.dialogRef.close({isDeleted: false});
  }

  public editarMateria(){
    this.MateriasService.editarMateria(this.data.materia).subscribe(
      (response)=>{
        alert("Materia editada correctamente");
        console.log("Materia editada: ", response);
        this.dialogRef.close({isDeleted: true});
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar la materia");
      }
    );
  }
}
