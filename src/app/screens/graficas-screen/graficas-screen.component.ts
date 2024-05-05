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
  public total_users: any = {};
  data: any;
  result: any;

  constructor(
    private administradoresServices: AdministradorService,
  ){}

    ngOnInit(): void {
      this.administradoresServices.getTotalUsuarios().subscribe(
        (response) => {
          const { admins, maestros, alumnos } = response;
          this.result = [admins, maestros, alumnos];

          this.data = this.result.map(value => Number(value));
          console.log("Total usuarios: ", this.data);

          //Grafica de Histograma
          this.lineChartData = {
            labels: ["Administradores", "Maestros", "Alumnos"],
            datasets: [
              {
                data: this.data,
                backgroundColor: '#F88406'
              }
            ]
          };

          //Grafica de Barras
          this.barChartData = {
            labels: ["Administradores", "Maestros", "Alumnos"],
            datasets: [
              {
                data: this.data,
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
            labels: ["Administradores", "Maestros", "Alumnos"],
            datasets: [
              {
                data: this.data,
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
            labels: ["Administradores", "Maestros", "Alumnos"],
              datasets: [
                {
                  data: this.data,
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
        (error) => {
          alert("No se pudo obtener el total de cada rol de usuarios");
        }
      );
    }

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

