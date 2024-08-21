import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { ChartOptions, IBalance } from '../../../../interfaces';

@Component({
    selector: 'app-incomes-vs-expenses-chart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './incomes-vs-expenses-chart.component.html',
    styleUrl: './incomes-vs-expenses-chart.component.scss',
})
export class IncomesVsExpensesChartComponent implements OnChanges {

    @ViewChild("chart") chart: ChartComponent | undefined;
    @Input() IncomesData: number[] = [];
    @Input() ExpensesData: number[] = [];
    public chartOptions: Partial<ChartOptions>;

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
        if (changes['IncomesData'] || changes['ExpensesData']) {
            this.chartOptions.series = [
                {
                    name: "Ingresos",
                    data: this.IncomesData,
                    color: IBalance.surplus
                },
                {
                    name: "Gastos",
                    data: this.ExpensesData,
                    color: IBalance.deficit
                }
            ]
        }

    }
}
