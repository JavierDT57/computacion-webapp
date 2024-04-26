import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FacadeService } from 'src/app/services/facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    public facadeService: FacadeService,
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
  ) { }

  public esquemaMateria(){
    return {
      'rol':'',
      'first_name': '',
      'last_name': '',
      'fecha_nacimiento': '',
      'telefono': '',
      'cubiculo': '',
      'area_investigacion': '',
      'materias_json': [],
    }
  }

  //Validación para el formulario
  public validarMaestro(data: any, editar: boolean){
    console.log("Validando maestro... ", data);
    let error: any = [];



    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }




    if(!this.validatorService.required(data["fecha_nacimiento"])){
      error["fecha_nacimiento"] = this.errorService.required;
    }


    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["cubiculo"])){
      error["cubiculo"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["area_investigacion"])){
      error["area_investigacion"] = this.errorService.required;
    }

    if(data["materias_json"].length == 0){
      alert("Debes seleccionar materias para poder registrarte.");
    }
    //Return arreglo
    return error;
  }

  //Aquí van los servicios HTTP
  //Servicio para registrar un nuevo usuario
  public registrarMaestro (data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/maestros/`,data, httpOptions);
  }

  /*
  //Obtener la lista de maestros
  public obtenerListaMaestros(): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, {headers:headers});
  }

  //Obtener un solo maestro dependiendo su ID
  public getMaestroByID(idUser: Number){
    return this.http.get<any>(`${environment.url_api}/maestros/?id=${idUser}`,httpOptions);
  }


  //Servicio para actualizar un usuario
  public editarMaestro (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/maestros-edit/`, data, {headers:headers});
  }

  //Eliminar maestro
  public eliminarMaestro(idUser: number):Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/maestros-edit/?id=${idUser}`, {headers:headers});
  }
  */
}
