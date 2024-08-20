import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
export class EstimatedExpenseVsTotalExpenseChartComponent implements OnChanges {

  @ViewChild("chart") chart: ChartComponent | undefined;
  @Input() totalExpensesData: number[] = [];
  @Input() recurringExpensesData: number[] = [];
  public chartOptions: Partial<ChartOptions>

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "ENE",
          "FEB",
          "MAR",
          "ABR",
          "MAY",
          "JUN",
          "JUL",
          "AGO",
          "SEP",
          "OCT",
          "NOV",
          "DIC"
        ]
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalExpensesData'] || changes['recurringExpensesData']) {
      this.chartOptions.series = [
        {
          name: "Gastos Totales",
          data: this.totalExpensesData,
          color: "#FF4560"
        },
        {
          name: "Gastos Estimados",
          data: this.recurringExpensesData,
          color: "#008FFB"
        }
      ]
    }
  }
}
