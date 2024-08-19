import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
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
import { ChartOptions } from '../../../../interfaces';

@Component({
    selector: 'app-currencies-chart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './currencies-chart.component.html',
    styleUrl: './currencies-chart.component.scss'
})
export class CurrenciesChartComponent implements OnChanges{ 

    @ViewChild("chart") chart: ChartComponent | undefined;
    public chartOptions: Partial<ChartOptions>;

    @Input() days: number[] = [];
    @Input() exchangeRate: number[] = [];


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
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                }
            },
            xaxis: {
                categories: []
            }
        };
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes['days'] || changes['exchangeRate']){
            this.chartOptions.series = [
                {
                    name: "Valor de la divisa",
                    data: this.exchangeRate,
                },
            ]

            this.chartOptions.xaxis!.categories = this.days;
        }
    }

}
