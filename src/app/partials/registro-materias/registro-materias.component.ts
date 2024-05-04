import { Component, Input, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { EditarMateriaModalComponent } from 'src/app/modals/editar-materia-modal/editar-materia-modal.component';
import { MatDialog } from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {
  //Decoradores
  @Input() rol: string = "";


  //Variables a ocupar
  public materia:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public id: Number = 0;
  public user: any = {};
  //Check
  public valoresCheckbox: any = [];
  //Inicializacion del JSON para los dias
  public dias_json: any [] = [];


//Dias y programas educativos para el form de las materias
//Para el select
public programas: any[] = [
  {value: '1', viewValue: 'Ingenieria en Ciencias de la Computacion'},
  {value: '2', viewValue: 'Licenciatura en Ciencias de la Computacion'},
  {value: '3', viewValue: 'Ingenieria en Tecnologias de la Informacion'},
];

//Para el checkbox de dias
public dias:any[]= [
  {value: '1', nombre: 'Lunes'},
  {value: '2', nombre: 'Martes'},
  {value: '3', nombre: 'Miercoles'},
  {value: '4', nombre: 'Jueves'},
  {value: '5', nombre: 'Viernes'},
  {value: '6', nombre: 'Sabado'},
];




  //Importacion de nuestros servicios
  constructor(
    private location : Location,
    public dialog: MatDialog,
    private materiasService: MateriasService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService
  ) { }



  ngOnInit(): void {
    // El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      // Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.id = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.id); // Hasta aca estoy bien, solo falta traer los datos del
      // Llama al método para obtener los datos del usuario y asi poder editarlos, utilizando su id como identidicador
      this.obtenerUserByID();
    } else {//Si no vamos a editar, por lo tanto se trata de un nuevo registro
      this.materia = this.materiasService.esquemaMateria();
      this.materia.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    // Imprimir datos en consola
    console.log("Materia: ", this.materia);
  }

  //Funcion el cual se encarga de de obtener los datos de la materia, mediante su ID,
  public obtenerUserByID() {
    this.materiasService.getMateriaByID(this.id).subscribe(//Se obtiene de la funcion GetMateria del materiasService el ID de la materia
      (response) => {//Si entramos al response le asignamos a la variables this.user toda la informacion del JSON de la materia
        this.user = response;
        console.log("Datos materia: ", this.user);//Imprimimos el response mediante la nueva variable para corroborar su funcionamiento
        this.initMateria(); // Llama a la función que inicializa this.materia después de obtener los datos del usuario
      //Se asigno una nueva funcion, ya que al inicar la vista de editar y se asignan los datos, es asíncrona, es decir aún no tiene los datos del usuario porque la petición HTTP aún no ha regresado.
      //Por lo tanto no mostraba nada de info, con esta nueva funcion se evita ese error
      },
      (error) => {
        alert("No se pudieron obtener los datos de la materia para editar");
      }
    );
  }
  // Esta función inicializa this.materia después de obtener los datos del usuario del response guardada en la variable this.user
  private initMateria() {
    this.materia = this.user;
  }


  //funciones de botones del form
  public regresar(){
    this.location.back();
  }

  public registrar(){

        //Validar
        this.errors = [];

        this.errors = this.materiasService.validarMateria(this.materia, this.editar);
        if(!$.isEmptyObject(this.errors)){
          return false;
        }

        // TODO:Después registraremos admin
      //Hacemos el Response para poder registrar Materias (Consumir el servicio)
        this.materiasService.registrarMateria(this.materia).subscribe(
          (response: any) => {//Se obtuve la peticion (se obtuvo respuesta del servicio)
            alert("Materia registrada correctamente");
            console.log("Materia registrada correctamente: ", response);
            this.router.navigate(["home"]);
          },
          (error: any) => {//No se obtuvo la peticion y se manda un alert
            alert("Error al registrar la materia, ese NRC ya fue registrado");
          }
        );

  }

  public actualizar(){
    //Validación de los campos a la hora de editar
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");//Si todo salio bien, se imprime en consola

    //Se muestra el modal para confirmar o cancelar la edicion
    const dialogRef = this.dialog.open(EditarMateriaModalComponent,{
      data:{materia:this.materia}, //Se pasan los valores a trabes del componente de editarModal, ya que ahi se hace la funcionalidad de edicion
      height: '288px',
      width: '328px'
    });

    //Alerts para mostrar si se edito o no la materia, asimismo se muestra en consola para verificar su funcionamiento
    dialogRef.afterClosed().subscribe(result => {
      if(result.isDeleted){
        console.log("Materia editada");
        //Recargar pagina
        window.location.reload();
      }else{
        alert("Materia no editada")
        console.log("Materia no editada");
      }
    });

  }




  //Aun no puedo imprimir en consola la hora, pero si cacha el valor en el esquemaMaterias
  //No sirve la funcion xdxd
  public onTimeSet(event: any) {
    console.log(event);
    console.log(event.value.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

  }

  //Checkbox para materias(Dias que se imparten) y ver cuales fueron seleccioandas y cachar las que se eligieron
  public checkboxChange(event:any){
    //console.log("Evento: ", event);
    if(event.checked){
      this.materia.dias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materia);
  }


  //Revisa la seleccion de los dias a impartir la materia, en la vista de edicion de la misma
  public revisarSeleccion(nombre: string){
    if(this.materia.dias_json){
      var busqueda = this.materia.dias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
}
