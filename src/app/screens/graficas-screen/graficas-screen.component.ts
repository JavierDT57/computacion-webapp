import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart} from 'chart.js';
import { AdministradorService } from 'src/app/services/administrador.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  //Agregar chartjs-plugin-datalabels
  //Variables
  data: any;
  result: any;

  constructor(
    private administradoresServices: AdministradorService,
  ){}

  ngOnInit(): void {
    //Se consume la funcion getTotalUsuarios para que podamos saber cuantos usuarios se tienen desde la API
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {//Si todo sale bien, entra al response
        const { admins, maestros, alumnos } = response;//El JSON del response, los valores se les asigna a las variables
        this.result = [admins, maestros, alumnos];//Por lo tanto se le asigna los valores a la variables resultado

        this.data = this.result.map(value => Number(value)); //transforma cada elemento del array en un número utilizando la función Number()
        console.log("Total usuarios: ", this.data);//Imprimos el valor solo en numero de los usuarios registrados

        //Grafica de Histograma
        this.lineChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],//Se incorporan el tipo de usuario, conforme se devuelve el response desde la API
          datasets: [
            {
              data: this.data,//Se pasa la informacion de los usuarios registrados de manera dinamica
              backgroundColor: '#F88406'
            }
          ]
        };

        //Grafica de Barras
        this.barChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],//Se incorporan el tipo de usuario, conforme se devuelve el response desde la API
          datasets: [
            {
              data: this.data,//Se pasa la informacion de los usuarios registrados de manera dinamica
              backgroundColor: [
                '#F88406',
                '#FCFF44',
                '#82D3FB',
                '#FB82F5',
                '#2AD84A'
              ]
            }
          ]
        };
        //Grafica circular
        this.pieChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],//Se incorporan el tipo de usuario, conforme se devuelve el response desde la API
          datasets: [
            {
              data: this.data,//Se pasa la informacion de los usuarios registrados de manera dinamica
              label: 'Registro de usuarios',
              backgroundColor: [
                '#FCFF44',
                '#F1C8F2',
                '#31E731'
              ]
            }
          ]
        };
        // Doughnut
        this.doughnutChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],//Se incorporan el tipo de usuario, conforme se devuelve el response desde la API
          datasets: [
            {
              data: this.data,//Se pasa la informacion de los usuarios registrados de manera dinamica
              label: 'Registro de usuarios',
              backgroundColor: [
                '#F88406',
                '#FCFF44',
                '#31E7E7'
              ]
            }
          ]
        };

      },
      (error) => {//En caso no entre al response, se mostrara un alert para avisar que obtuvo a los usuarios
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  //Variable qu see utilizarán para almacenar los datos del gráfico y su configuracion

  //Histograma
  lineChartData: any;
  lineChartOption = {
    responsive:false
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData: any;
    // Declarar barChartData fuera del bloque de ngOnInit
  barChartOption = {
    responsive: false
  };
  barChartPlugins = [ DatalabelsPlugin ];

  //circular
  pieChartData: any;
  pieChartOption = {
    responsive:false
  }
  pieChartPlugins = [ DatalabelsPlugin ];

  //Doughnut
  doughnutChartData: any;
  doughnutChartOption = {
    responsive:false
  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

}

