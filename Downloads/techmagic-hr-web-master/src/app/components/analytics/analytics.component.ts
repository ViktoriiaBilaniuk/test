import {Component, OnInit} from '@angular/core';
import {ChartService} from './../../services/chart.service';

@Component({
  selector: 'hr-analytics',
  templateUrl: 'analytics.component.html',
  styleUrls: ['analytics.component.sass']
})
export class AnalyticsComponent implements OnInit {
  private dateRange = {
    dateFrom: '',
    dateTo: ''
  };

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    this.getExperiences();
    this.getAges();
    this.getGrows();
    this.getLeftCompany();
    this.getNewPerMonth();
    this.getLeftPerMonth();
    this.getGenders();
    this.getReasons();
    this.getDepartments();
    this.getTurnover();
    this.initDatePicker();
  }

  getExperiences() {
    this.chartService.getExperiencesStats().subscribe(
      data => this.chartService.createBarChart(data, '#bar-chart-exps'),
      error => console.error('Error', error)
    );
  }

  getAges() {
    this.chartService.getAgesStat().subscribe(
      data => this.chartService.createBarChart(data, '#bar-chart-ages'),
      error => console.error('Error', error)
    );
  }

  getGrows() {
    this.chartService.getGrowsStat(this.dateRange).subscribe(
      data => this.chartService.createBarChart(data, '#bar-chart-grows'),
      error => console.error('Error', error)
    );
  }

  getLeftCompany() {
    this.chartService.getLeftCompanyStat(this.dateRange).subscribe(
      data => this.chartService.createBarChart(data, '#bar-chart-left-company'),
      error => console.error('Error', error)
    );
  }

  getNewPerMonth() {
    this.chartService.getNewPerMonthStat(this.dateRange).subscribe(
      data => this.chartService.createBarChart(data, '#bar-chart-new-per-month'),
      error => console.error('Error', error)
    );
  }

  getLeftPerMonth() {
    this.chartService.getLeftPerMonthStat(this.dateRange).subscribe(
      data => this.chartService.createBarChart(data, '#bar-chart-left-per-month'),
      error => console.error('Error', error)
    );
  }

  getReasons() {
    this.chartService.getReasonsStat(this.dateRange).subscribe(
      data => this.chartService.createBarChart(data, '#bar-chart-reasons'),
      error => console.error('Error', error)
    );
  }

  getGenders() {
    this.chartService.getGendersStat().subscribe(
      data => this.chartService.createPieChart(data, '#pie-chart-genders'),
      error => console.error('Error', error)
    );
  }


  getDepartments() {
    this.chartService.getDepartmentsStat().subscribe(
      data => this.chartService.createPieChart(data, '#pie-chart-departments'),
      error => console.error('Error', error)
    );
  }

  getTurnover() {
    this.chartService.getTurnoverStat().subscribe(
      data => {
        this.chartService.createBarChart(data.chartsData.byYears, '#bar-chart-turnover-by-years');
        this.chartService.createBarChart(data.chartsData.byQuarters, '#bar-chart-turnover-by-quarters');
        },
      error => console.log('Error', error)
    );
  }

  /**
   * @description - Method for initializing date pickers
   * > After initializing add event listener for change date event
   * @memberOf AnalyticsComponent
   */
  initDatePicker() {
    $('.charts-controls input').datepicker({
      autoclose: true,
      format: 'MM yyyy',
      startView: 1,
      minViewMode: 1
    })
    .on('changeDate', (e) => {
      const chosenDate = new Date($(e.currentTarget).datepicker('getUTCDate')).getTime();
      if (e.currentTarget.id === 'datepicker-dateFrom') {
        this.dateRange.dateFrom = '' + chosenDate;
      } else {
        this.dateRange.dateTo = '' + chosenDate;
      }
      this.getGrows();
      this.getLeftCompany();
      this.getNewPerMonth();
      this.getLeftPerMonth();
      this.getReasons();
    });
  }
}
