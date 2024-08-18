import { CommonModule } from '@angular/common';
import { Component, ViewChild } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { ChartOptions } from '../../../interfaces';

@Component({
    selector: 'app-barchart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './barchart.component.html',
    styleUrl: './barchart.component.scss'
})
export class BarchartComponent {
    @ViewChild("chart")
    chart!: ChartComponent;
    
    public chartOptions: Partial<ChartOptions>;

    constructor() {
          this.chartOptions = {
              series: [
                  {
                      name: "Net Profit",
                      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
                  },
                  {
                      name: "Revenue",
                      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
                  },
                  {
                      name: "Free Cash Flow",
                      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
                  }
              ],
              chart: {
                  type: "bar",
                  height: 350
              },
              dataLabels: {
                  enabled: false
              },
              stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"]
              },
              xaxis: {
                  categories: [
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct"
                  ]
              },
              yaxis: {
                  title: {
                      text: "$ (thousands)"
                  }
              },
              fill: {
                  opacity: 1
              },
              tooltip: {
                  y: {
                      formatter: function(val) {
                          return "$ " + val + " thousands";
                      }
                  }
              }
          };
      }
}
