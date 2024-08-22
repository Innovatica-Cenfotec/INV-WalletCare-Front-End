import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexXAxis,
    ApexPlotOptions,
    NgApexchartsModule
  } from "ng-apexcharts";
import { ChartOptions } from '../../../../interfaces';

@Component({
    selector: 'app-new-users-chart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './new-users-chart.component.html',
    styleUrl: './new-users-chart.component.scss',
})
export class NewUsersChartComponent { 


    @ViewChild("chart") chart: ChartComponent | undefined;
    @Input() NewUsersData: number[] = [];
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        this.chartOptions = {
            series: [],
            chart: {
                height: 350,
                type: "bar",
                zoom: {
                    enabled: false
                }
            },
            plotOptions: {
                bar: {
                  horizontal: true
                }
              },
            dataLabels: {
                enabled: true
            },
            title: {
                text: "",
                align: "left"
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
        if (changes['NewUsersData']) {
            this.chartOptions.series = [
                {
                    name: "Nuevos Ingresos",
                    data: this.NewUsersData,
                },

            ]
        }

    }

}
