import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { EliminarMateriaModalComponent } from 'src/app/modals/eliminar-materia-modal/eliminar-materia-modal.component';



@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {


  public name_user:string = "";
  public rol:string = "";
  public token : string = "";
  public lista_materias: any[] = [];
//Para la tabla
displayedColumns: string[] = ['nrc_materia', 'nombre_materia', 'hora_inicial', 'hora_final','seccion_materia', 'salon_materia', 'programa_materia', 'dias_json', 'editar', 'eliminar'];

dataSource = new MatTableDataSource<DatosUsuario>(this.lista_materias as DatosUsuario[]);

@ViewChild(MatPaginator) paginator: MatPaginator;

constructor(
  public facadeService: FacadeService,
  private materiasService:MateriasService,
  private router: Router,
  public dialog: MatDialog
){}

ngOnInit(): void {
  this.name_user = this.facadeService.getUserCompleteName();
  this.rol = this.facadeService.getUserGroup();
  //Validar que haya inicio de sesión
  //Obtengo el token del login
  this.token = this.facadeService.getSessionToken();
  console.log("Token: ", this.token);

  if(this.token == ""){
    this.router.navigate([""]);
  }

  this.obtenerMaterias();
  //Para paginador
  this.initPaginator();
}
//Para paginación
public initPaginator(){
  setTimeout(() => {
    this.dataSource.paginator = this.paginator;
    //console.log("Paginator: ", this.dataSourceIngresos.paginator);
    //Modificar etiquetas del paginador a español
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 / ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Página siguiente';
  },500);
  //this.dataSourceIngresos.paginator = this.paginator;
}
 //Obtener alumnos
 public obtenerMaterias(){
  this.materiasService.obtenerListaMaterias().subscribe(
    (response)=>{
      this.lista_materias = response;
      console.log("Lista users: ", this.lista_materias);
      if(this.lista_materias.length > 0){
        console.log("Otro user: ", this.lista_materias);

        this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_materias as DatosUsuario[]);
      }
    }, (error)=>{
      alert("No se pudo obtener la lista de materias");
    }
  );
}

//Funcion para editar Materias pasandole solo el aprametro de ID del registro
public goEditar(id: number){
  this.router.navigate(["registro-materias/"+id]);
}

public delete(id: number) {
  console.log("User: ", id);
  const dialogRef = this.dialog.open(EliminarMateriaModalComponent,{
    data:{id:id}, //Se pasan los valores a trabes del componente
    height: '288px',
    width: '328px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result.isDeleted){
      console.log("Materia eliminada");
      //Recargar pagina
      window.location.reload();
    }else{
      alert("Materia no eliminada")
      console.log("Materia no eliminado");
    }
  });
}

}//Fin

//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  nrc_materia: number;
  nombre_materia: string;
  hora_inicial: string;
  hora_final: string;
  seccion_materia: number,
  salon_materia: string,
  programa_materia: string,
  //dias_json: []
}


