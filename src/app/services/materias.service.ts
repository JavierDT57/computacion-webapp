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
      'nrc_materia': '',
      'nombre_materia': '',
      'seccion_materia': '',
      'hora_inicial': '',
      'hora_final': '',
      'salon_materia': '',
      'programa_materia': '',
      'dias_json': [],
    }
  }

  //Validación para el formulario
  public validarMateria(data: any, editar: boolean){
    console.log("Validando materia... ", data);
    let error: any = [];


    if(!this.validatorService.required(data["nrc_materia"])){
      error["nrc_materia"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["nrc_materia"])){
      error["nrc_materia"] = this.errorService.numeric;
      alert("Solo se aceptan valores numericos");
    }

    if(!this.validatorService.required(data["nombre_materia"])){
      error["nombre_materia"] = this.errorService.required;
    }




    if(!this.validatorService.required(data["hora_inicial"])){
      error["hora_inicial"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["hora_final"])){
      error["hora_final"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["seccion_materia"])){
      error["seccion_materia"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["seccion_materia"])){
      error["seccion_materia"] = this.errorService.numeric;
      alert("Solo se aceptan valores numericos");
    }

    if(!this.validatorService.required(data["salon_materia"])){
      error["salon_materia"] = this.errorService.required;
    }


    if(!this.validatorService.required(data["programa_materia"])){
      error["programa_materia"] = this.errorService.required;
    }

    if(data["dias_json"].length == 0){
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
