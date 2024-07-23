import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {NzResultComponent, NzResultExtraDirective} from "ng-zorro-antd/result";

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [
        CommonModule,
        NzResultComponent,
        NzResultExtraDirective,
    ],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent { }
