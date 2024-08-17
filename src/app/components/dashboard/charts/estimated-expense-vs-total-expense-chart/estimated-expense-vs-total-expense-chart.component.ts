import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartOptions } from '../../../../interfaces';
import { CommonModule } from '@angular/common';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule
} from "ng-apexcharts";

@Component({
  selector: 'app-estimated-expense-vs-total-expense-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  templateUrl: './estimated-expense-vs-total-expense-chart.component.html',
  styleUrl: './estimated-expense-vs-total-expense-chart.component.scss'
})
export class EstimatedExpenseVsTotalExpenseChartComponent implements OnInit {

  public chartOptions: any;
  @ViewChild("chart") chart: ChartComponent | undefined;
  @Input() TotalExpensesData: number[] = [];
  @Input() EstimatedExpensesData: number[] = [];

  ngOnInit(): void {
      this.initializeChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['TotalExpensesData'] || changes['EstimatedExpensesData']) {
      	this.updateChartSeries();  
    }
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      title: {
        text: "Comparación de Gastos",
        align: "left"
      },
      xaxis: {
        categories: [
          "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
          "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
        ]
      },
      dataLabels: {
        enabled: true
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      }
    };
  }

  private updateChartSeries(): void {
    this.chartOptions.series = [
      {
        name: "Gastos Totales",
        data: this.TotalExpensesData,
        color: "#FF4560"
      },
      {
        name: "Gastos Recurrentes",
        data: this.EstimatedExpensesData,
        color: "#008FFB"
      }
    ]
  }

}
