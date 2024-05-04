import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
declare var $:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  //Decoradores
  @Input() tipo: string = "";
  @Input() rol:string ="";

  //Variables a ocuapr para  almacenar el token y activar la bandera de editar
  public editar:boolean = false;
  public token:string = "";

  constructor(
    private router:Router,
    private facadeService: FacadeService,
    public activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
    //Con esto cachamos el rol que esta en la pagina, ocuoando el componente FacadeService y lo almacenamos en la variables rol
    this.rol  = this.facadeService.getUserGroup();
    console.log("Rol NavBar: ", this.rol);//Imprimimos el rol en consola para verificar que funciona

    //Con esta funcion obtenemos el token del usuario logueado mediante su ID
    this.token = this.facadeService.getSessionToken();
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
    }
  }

  //Funcion para poder cerrar secion
  public logout(){
    this.facadeService.logout().subscribe(
      (response)=>{
        console.log("Entró");
        this.facadeService.destroyUser();
        //Navega al login
        this.router.navigate(["/"]);
      }, (error)=>{
        console.error(error);
      }
    );
  }
  //Nos redirige a los componentes de registro de usuarios o materias
  public goRegistro(){
    this.router.navigate(["registro-usuarios"]);
  }

  public goRegistroMaterias(){
    this.router.navigate(["registro-materias"]);
  }



  public clickNavLink(link: string){
    this.router.navigate([link]);
    setTimeout(() => {
      this.activarLink(link);
    }, 100);
  }
  public activarLink(link: string){
    if(link == "alumnos"){
      $("#principal").removeClass("active");
      $("#maestro").removeClass("active");
      $("#alumno").addClass("active");
    }else if(link == "maestros"){
      $("#principal").removeClass("active");
      $("#alumno").removeClass("active");
      $("#maestro").addClass("active");
    }else if(link == "home"){
      $("#alumno").removeClass("active");
      $("#maestro").removeClass("active");
      $("#principal").addClass("active");
    }else if(link == "graficas"){
      $("#alumno").removeClass("active");
      $("#maestro").removeClass("active");
      $("#principal").removeClass("active");
      $("#graficas").addClass("active");
    }
  }
}
