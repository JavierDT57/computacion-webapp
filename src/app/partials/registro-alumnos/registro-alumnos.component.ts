import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

declare var $: any;

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit{
  @Input() rol:string = "";
  //JSON para alumnos
  @Input() datos_user:any = {}; //Input to receive the user data from the parent component

  //Variables
  public alumno:any = {}; //Object to store the student data
  public editar:boolean = false; //Variable to know if the student is being edited
  public errors:any = {}; //Object to store the errors
  //For passwords
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';
  //Variables to store the token and user ID
  public token : string = ""; //Variable to store the token
  public idUser: Number = 0; //Variable to store the user ID
  //Constructor
  constructor(
    private alumnosService: AlumnosService,
    private location : Location,
    public activatedRoute : ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router
  ) { }


  ngOnInit(): void {
     //El primer if valida si existe un parámetro en la URL
     if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.alumno = this.datos_user;
    }else{
      this.alumno = this.alumnosService.esquemaAlumno();
      this.alumno.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Alumno: ", this.alumno);
  }

   //funciones de botones del form
   public regresar(){

   }

   public registrar(){

        //Validar
        this.errors = [];

        this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
        if(!$.isEmptyObject(this.errors)){
          return false;
        }

        // TODO:Después registraremos admin
        if(this.alumno.password == this.alumno.confirmar_password){
          this.alumnosService.registrarAlumno(this.alumno).subscribe(
            (response: any) => {
              alert("Usuario registrado correctamente");
              console.log("Usuario registrado correctamente: ", response);
              this.router.navigate(['/']);
            },
            (error: any) => {
              alert("Error al registrar usuario");
            }
          );

        }else{
          alert("Las contraseñas no coinciden");
          this.alumno.password = "";
          this.alumno.confirmar_password = "";
        }

   }

   public actualizar(){
    //Validacion
    this.errors = [];
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Paso la validacion");
    this.alumnosService.editarAlumno(this.alumno).subscribe(
      (response)=>{
        alert("Alumno editado correctamente");
        console.log("Alumno editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el alumno");
      }
    );
  }


  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }


  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }



}
