import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-fee-calculator',
    standalone: true,
    imports: [
        CommonModule,
        NzButtonModule,
        NzModalModule
    ],
    templateUrl: './fee-calculator.component.html',
    styleUrl: './fee-calculator.component.scss',
})
export class FeeCalculatorComponent {
    @Input() isVisible = false;
    isConfirmLoading = false;


    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isConfirmLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
        }, 1000);
    }

    handleCancel(): void {
        this.isVisible = false;
    }
}
