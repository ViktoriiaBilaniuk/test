import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartService } from './../../services/chart.service';
import { AnalyticsComponent } from './analytics.component';

// Routing is required with lazy loading
export const ROUTES: Routes = [
    {path: '', component: AnalyticsComponent}
];

@NgModule({
    declarations: [AnalyticsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
    ],
    providers: [ChartService],
    bootstrap: [AnalyticsComponent]
})

export class AnalyticsModule {}
