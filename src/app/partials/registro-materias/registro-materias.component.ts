import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

declare var $: any;

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent {
  @Input() rol: string = "";
  @Input() datos_user: any = {};


  public materia:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;
  //Check
  public valoresCheckbox: any = [];
  public dias_json: any [] = [];

//materias y areas de investigacion para form maestros
//Para el select
public areas: any[] = [
  {value: '1', viewValue: 'Ingenieria en Ciencias de la Computacion'},
  {value: '2', viewValue: 'Licenciatura en Ciencias de la Computacion'},
  {value: '3', viewValue: 'Ingenieria en Tecnologias de la Informacion'},
];

public dias:any[]= [
  {value: '1', nombre: 'Lunes'},
  {value: '2', nombre: 'Martes'},
  {value: '3', nombre: 'Miercoles'},
  {value: '4', nombre: 'Jueves'},
  {value: '5', nombre: 'Viernes'},
  {value: '6', nombre: 'Sabado'},
];




  constructor(
    private location : Location,
    private materiasService: MateriasService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.materia = this.datos_user;
    }else{
      this.materia = this.materiasService.esquemaMateria();
      this.materia.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Maestro: ", this.materia);
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
        //validar contrasena
        if(this.materia.password == this.materia.confirmar_password){
          this.materiasService.registrarMaestro(this.materia).subscribe(
            (response: any) => {
              alert("Usuario registrado correctamente");
              console.log("Usuario registrado correctamente: ", response);
              this.router.navigate(['/']);
            },
            (error: any) => {
              alert("Error al registrar usuario");
            }
          );

        }

  }

  public actualizar(){
    //Validación
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    /*
    this.materiasService.editarMateria(this.maestro).subscribe(
      (response)=>{
        alert("Maestro editado correctamente");
        console.log("Maestro editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el maestro");
      }
    );
    */
  }


    //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.materia.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.materia.fecha_nacimiento);
  }

  //Checkbox para materias

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
