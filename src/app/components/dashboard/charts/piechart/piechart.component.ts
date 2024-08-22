import { CommonModule } from '@angular/common';
import { Component, ViewChild, Input, OnChanges, SimpleChanges } from "@angular/core";

// Importing Ng-Zorro modules
import { ChartComponent, NgApexchartsModule, ChartType } from "ng-apexcharts";

// CUSTOM COMPONENT
import { ChartOptions, IPiechartData } from '../../../../interfaces';

@Component({
    selector: 'app-piechart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './piechart.component.html',
    styleUrl: './piechart.component.scss'
})
/**
 * Reusable component for pie grapts. Receive a ChartType ('pie', 'donut').
 */
export class PiechartComponent implements OnChanges {
    /**
     * Chart context.
     */
    @ViewChild("chart")
    chart: ChartComponent | undefined;

    /**
     * Json structure expected by the chart.
     */
    @Input() data: IPiechartData[];

    /**
     * Variable with the expected order for the labels.
     */
    @Input() labelsOrder: string[];

    /**
     * Json structure expected by the chart.
     */
    @Input() type: ChartType;

    /**
     * Config of the chart data (ex: labels and amounts).
     */
    public chartOptions: Partial<ChartOptions>;

    /**
     * Initialize default chart options
     */
    constructor() {
        this.data = [];
        this.labelsOrder = [];
        this.type = "pie";

        this.chartOptions = {
            series: [],
            chart: {
                width: '90%',
                height: 350,
                type: this.type
            },
            labels: [],
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
            ],
            noData: {
                text: "No se encontraron registros",
                align: 'center',
                verticalAlign: 'middle',
                offsetX: 0,
                offsetY: 0,
                style: {
                  fontSize: '15px'
                }
            }
        };
    }
    
    /**
     * Load the chart data.
     */
    loadChart(): void{
        const labels = this.getPieLabels(this.data);
        const series = labels.map(label => {
            const item = this.data.find(item => this.toCapitalCase(this.getGoalType(item.category)) === label);
            return item ? item.data : 0;
        });

        this.chartOptions.series = series;
        this.chartOptions.labels = labels;
    }

    /**
     * Load chart when data is change.
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.loadChart();
        }
    }

    /**
     * Get the goal type of a string, case-insensitive
     * @param data String value with the category to get
     * @returns A string equivalent of inserted value
     */
    getGoalType(data: string): string {
        switch (data.toUpperCase()) {
            case "GOAL_PENDING":
                return "recomendados";
            case "GOAL_REJECTED":
                return "denegados";
            case "ACTIVE":
                return "en proceso";
            case "COMPLETED":
                return "completados";
            case "FAILED":
                return "fallados";
            case "NULL":
                return "sin datos";
            default:
                return "sin estado";
        }
    }

    /**
     * Get array of labels. Filter and sort labels if labelsOrder is set, case-insensitive.
     * @param data Data to fill chart.
     * @returns List of labels capitalized.
     */
    private getPieLabels(data: IPiechartData[]): string[] {
        const labelsSet = new Set<string>();

        if (this.labelsOrder.length > 0) {
            // Ensure case insensitivity by converting labelsOrder to lowercase
            const labelsOrder = this.labelsOrder.map(label => label.toLowerCase());

            // Only list labels found in data and in labelsOrder
            data.forEach(item => {
                const label = this.getGoalType(item.category).toLowerCase();
                if (labelsOrder.includes(label)) {
                    labelsSet.add(this.toCapitalCase(label));
                }
            });

            return Array.from(labelsSet).sort(
                (a, b) => labelsOrder.indexOf(a.toLowerCase()) - labelsOrder.indexOf(b.toLowerCase())
            );
        } else {
            // Just add all labels from data, case-insensitive
            data.forEach(item => {
                const label = this.getGoalType(item.category);
                labelsSet.add(this.toCapitalCase(label));
            });

            return Array.from(labelsSet);
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
