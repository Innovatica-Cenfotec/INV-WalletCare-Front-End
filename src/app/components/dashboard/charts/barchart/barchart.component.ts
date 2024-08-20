import { CommonModule } from '@angular/common';
import { Component, OnChanges, ViewChild, Input, SimpleChanges } from "@angular/core";

// Importing Ng-Zorro modules
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

// CUSTOM COMPONENT
import { ChartOptions, IBarcharItem, IBarchartData } from '../../../../interfaces';

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
/**
 * Reusable component for bar grapts. Receive a yAxisLabel, xAxisLabel and amount.
 */
export class BarchartComponent implements OnChanges {
    /**
     * Chart context.
     */
    @ViewChild("chart")
    chart: ChartComponent | undefined;

    /**
     * Json structure expected by the chart.
     */
    @Input() data: IBarchartData[] = [];

    /**
     * Variable with the expected order for the x axis labels.
     */
    @Input() xAxisOrder: string[] = [];

    /**
     * Config of the chart data (ex: labels y axis, labels x axis, ₡ amounts).
     */
    public chartOptions: Partial<ChartOptions> = {};

    /**
     * Load chart when data is change.
     */
    ngOnChanges(): void {
        this.loadChart();
    }

    /**
     * Load the chart data.
     */
    loadChart(): void {
        const xAxisLabels = this.getXAxisLabels(this.data);
        const series = this.data.map(item => ({
            name: this.getCategory(item),
            data: xAxisLabels.map(date => {
                const objI = item.data.find(i => this.getMonth(i).toUpperCase() === date);
                return objI ? objI.amount : 0;
            })
        }));

        console.log(series);

        this.chartOptions = {
            series: series,
            chart: {
                type: "bar",
                height: 350
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: xAxisLabels
            },
            yaxis: {
                labels: {
                    formatter: (val) => {
                        return val / 1000 + "K";
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return "₡ " + val;
                    }
                }
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
            },
            grid: {
                row: {
                    // takes an array which will be repeated on columns
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5
                }
            },
            title: {
                text: "",
                align: "left"
            }
        };
    }

    /**
     * Get category name. Capitalized.
     * @param item IBarcharData with the item to get category.
     * @returns The value of the category.
     */
    private getCategory(item: IBarchartData) {
        switch (item.category?.toLowerCase()) {
            case 'uncategorized' || '' || null:
                return this.toCapitalCase('sin categoría');
            default:
                return this.toCapitalCase(item.category);
        }
    }

    /**
     * Get month name. Spanish equivalent.
     * @param item IBarcharData with the item to get month.
     * @returns The value of the month.
     */
    private getMonth(item: IBarcharItem) {
        switch (item.month?.toLowerCase()) {
            case 'jan':
                return 'Ene';
            case 'feb':
                return 'Feb';
            case 'mar':
                return 'Mar';
            case 'apr':
                return 'Abr';
            case 'may':
                return 'May';
            case 'jun':
                return 'Jun';
            case 'jul':
                return 'Jul';
            case 'aug':
                return 'Ago';
            case 'sep' || 'sept':
                return 'Sep';
            case 'oct':
                return 'Oct';
            case 'nov':
                return 'Nov';
            case 'dec':
                return 'Dic';
            default:
                return this.toCapitalCase(item.month);
        }
    }

    /**
     * Get array of labels for x axis. Compare values with uppercase.
     * Sort labels if xAxisOrder is set.
     * @param data Data to fill grapt.
     * @returns List of labels in uppercase.
     */
    private getXAxisLabels(data: IBarchartData[]): string[] {
        const datesSet = new Set<string>();

        data.forEach(item => {
            item.data.forEach(
                // This will set how the label is view in grapt
                i => datesSet.add(this.getMonth(i).toUpperCase())
            );
        });

        const axisLabels = Array.from(datesSet);

        if (this.xAxisOrder.length != 0) {
            return axisLabels.sort(
                // Order the xAxis labels
                (a, b) => this.xAxisOrder.indexOf(a.toUpperCase()) - this.xAxisOrder.indexOf(b.toUpperCase())
            );
        } else {
            return axisLabels;
        }
    }

    /**
     * Capitalize a string.
     * @param msj message to capitalize.
     * @returns capitalized messaje.
     */
    private toCapitalCase(msj: string) {
        return msj ? msj.charAt(0).toUpperCase() + msj.substr(1).toLowerCase() : '';
    }
}