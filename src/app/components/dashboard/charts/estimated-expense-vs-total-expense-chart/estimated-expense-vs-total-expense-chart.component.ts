import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { ChartOptionsNonAxis } from "../../../../interfaces";

import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
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

  @Input() totalExpensesData: number[] = [];
  @Input() recurringExpensesData: number[] = [];
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptionsNonAxis>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        width: '90%',
        height: 350,
        type: "pie"
      },
      labels: [],
      fill: {
        colors: ['#FF4560', '#008FFB']
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalExpensesData'] || changes['recurringExpensesData']) {
      const total = this.totalExpensesData.reduce((a, b) => a + b, 0);
      const recurring = this.recurringExpensesData.reduce((a, b) => a + b, 0);
      this.chartOptions.series = [
        Math.abs(total),
        Math.abs(recurring)
      ];

      this.chartOptions.labels = ["Gastos Totales", "Gastos Estimados"];
      this.chartOptions.fill = {
        colors: ["#FF4560", "#008FFB"]
      };
      console.log('Chart options:', this.chartOptions);
    }
  }
}