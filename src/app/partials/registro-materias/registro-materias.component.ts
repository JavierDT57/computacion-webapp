import { Component, Input, OnInit} from '@angular/core';
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
export class RegistroMateriasComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};


  public materia:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public id: Number = 0;
  public datos_userr: any = {};
  public user: any = {};
  //Check
  public valoresCheckbox: any = [];
  public dias_json: any [] = [];

  public minTime: string = '00:00:00'; // Establece el valor mínimo deseado
  public maxTime: string = '23:59:00'; // Establece el valor máximo deseado


//Dias y programas educativos para el form de las materias
//Para el select
public programas: any[] = [
  {value: '1', viewValue: 'Ingenieria en Ciencias de la Computacion'},
  {value: '2', viewValue: 'Licenciatura en Ciencias de la Computacion'},
  {value: '3', viewValue: 'Ingenieria en Tecnologias de la Informacion'},
];

//Para el checkbox
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
    // El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      // Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.id = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.id); // Hasta aca estoy bien, solo falta traer los datos del
      // Esto es lo que me falta
      // Llama al método para obtener los datos del usuario
      this.obtenerUserByID();
    } else {
      this.materia = this.materiasService.esquemaMateria();
      this.materia.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    // Imprimir datos en consola
    console.log("Materia: ", this.materia);
  }

  public obtenerUserByID() {
    this.materiasService.getMateriaByID(this.id).subscribe(
      (response) => {
        this.user = response;
        console.log("Datos materia: ", this.user);
        this.initMateria(); // Llama a la función que inicializa this.materia después de obtener los datos del usuario
      },
      (error) => {
        alert("No se pudieron obtener los datos de la materia para editar");
      }
    );
  }
  // Esta función inicializa this.materia después de obtener los datos del usuario
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
    //Validación
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");


    this.materiasService.editarMateria(this.materia).subscribe(
      (response)=>{
        alert("Materia editada correctamente");
        console.log("Materia editada: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar la materia");
      }
    );

  }

  public changeHora(event: any) {
    console.log(event);

    // Obtiene la hora y los minutos de la fecha seleccionada
    const horaSeleccionada = event.value.getHours();
    const minutosSeleccionados = event.value.getMinutes();

    // Formatea la hora y los minutos en una cadena de texto con el formato deseado
    const horaFormateada = horaSeleccionada.toString().padStart(2, '0') + ':' + minutosSeleccionados.toString().padStart(2, '0');

    // Asigna la hora formateada al modelo de datos
    this.materia.hora_inicial = horaFormateada;

    console.log("Hora: ", this.materia.hora_inicial);
  }



  //Aun no puedo imprimir en consola la hora, pero si cacha el valor en el esquemaMaterias
  public onTimeSet(event: any) {
    console.log(event);
    console.log(event.value.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

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
