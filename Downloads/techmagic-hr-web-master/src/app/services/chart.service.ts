import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
const d3 = require('d3');
import 'rxjs/add/operator/map';

import {environment} from './../../environments/environment';
import {AuthService} from './auth.service';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class ChartService {
  // Bar chart config
  private barChartMargin = {top: 20, right: 10, bottom: 100, left: 30};
  private barChartOptions = {
    width: 700 - this.barChartMargin.right - this.barChartMargin.left,
    height: 500 - this.barChartMargin.top - this.barChartMargin.bottom
  };

  // Pie chart config
  private pieChartMargin = {top: 20, right: 20, bottom: 20, left: 20};
  private pieChartOptions = {
    width: 800 - this.pieChartMargin.right - this.pieChartMargin.left,
    height: 800 - this.pieChartMargin.top - this.pieChartMargin.bottom,
    radius: (500 - this.pieChartMargin.right - this.pieChartMargin.left) / 2
  };
  private pieColor = d3.scaleOrdinal()
    .range(['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2']);

  constructor(private http: Http, private auth: AuthService) {}

  // Getters
  getExperiencesStats() {
    return this.http.get(`${API_ENDPOINT}/charts/work-duration`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getAgesStat() {
    return this.http.get(`${API_ENDPOINT}/charts/ages`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getGrowsStat(dateRange) {
    return this.http.get(`${API_ENDPOINT}/charts/growing?dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}`,
      this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getLeftCompanyStat(dateRange) {
    return this.http.get(`${API_ENDPOINT}/charts/left-company?dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}`,
      this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getNewPerMonthStat(dateRange) {
    return this.http.get(`${API_ENDPOINT}/charts/new-people?dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}`,
      this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getLeftPerMonthStat(dateRange) {
    return this.http.get(`${API_ENDPOINT}/charts/people-leave?dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}`,
      this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }


  getGendersStat() {
    return this.http.get(`${API_ENDPOINT}/charts/genders`,
      this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getReasonsStat(dateRange) {
    return this.http.get(`${API_ENDPOINT}/charts/reasons?dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}`,
      this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getDepartmentsStat() {
    return this.http.get(`${API_ENDPOINT}/charts/departments`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getFirstWorkingDay() {
    return this.http.get(`${API_ENDPOINT}/charts/first-working-day`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getTurnoverStat() {
    return this.http.get(`${API_ENDPOINT}/charts/turnover`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }


  // Charts generators
  createBarChart(data, domId) {
    d3.select(`${domId} svg`).remove();
    const svg = d3.select(domId)
      .append('svg')
      .attr('width', this.barChartOptions.width + this.barChartMargin.right + this.barChartMargin.left)
      .attr('height', this.barChartOptions.height + this.barChartMargin.top + this.barChartMargin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.barChartMargin.left + ',' + this.barChartMargin.right + ')');

    // Define the div for the tooltip
    const div = d3.select(domId).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // define x and y scales
    const xScale = d3.scaleBand()
      .rangeRound([0, this.barChartOptions.width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .rangeRound([this.barChartOptions.height, 0]);

    // define axis
    const xAxis = d3.axisBottom()
      .scale(xScale);

    const yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(1);

    // specify the domains of the x and y scales
    xScale.domain(data.map((d) => d.name));
    yScale.domain([0, d3.max(data, (d) => d.count)]);

    // draw the bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')

      .on('mouseover', (d) => {
        this.showTooltip(div, d);
      })
      .on('mouseout', (d) => {
        this.hideTooltip(div);
      })

      .attr('x', (d) => xScale(d.name))
      .attr('width', xScale.bandwidth())
      .attr('height', 0)                       // for animation
      .attr('y', this.barChartOptions.height)  // for animation
      .transition().duration(1000)             // for animation
      .delay((d, i) => i * 20)                // for animation
      .attr('y', (d) => yScale(d.count))
      .attr('height', (d) => this.barChartOptions.height - yScale(d.count))
      .style('fill', (d, i) => 'rgb(135,206, ' + ((i * 10) + 180) + ')');             // color range

    // draw the Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.barChartOptions.height + ')')
      .call(xAxis)
      .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(90)')
      .style('text-anchor', 'start');

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
  }

  createPieChart(data, domId) {
    // arc generator
    const arc = d3.arc()
      .outerRadius(this.pieChartOptions.radius - 10)
      .innerRadius(0);

    // arc for the labels position
    const labelArc = d3.arc()
      .outerRadius((d) => {
        const increment = calculateIncrement(d.data.name);

        return this.pieChartOptions.radius + increment;
      })
      .innerRadius((d) => {
        const increment = calculateIncrement(d.data.name);
        const incrementItem = this.pieChartOptions.radius + increment;
        return incrementItem;
      });

    // function to calculate radius increment depending of name length
    function calculateIncrement(name) {
      if (name.length < 7) {
        return 30;
      } else if (name.length > 10) {
        return 70;
      } else {
        return 50;
      }
    }

    const pie = d3.pie()
      .sort(null)
      .value((d) => d.count);

    // define svg
    const svg = d3.select(domId).append('svg')
      .attr('width', this.pieChartOptions.width)
      .attr('height', this.pieChartOptions.height)
      .append('g')
      .attr('transform', 'translate(' + this.pieChartOptions.width / 2 + ',' + this.pieChartOptions.height / 2 + ')');

    // Define the div for the tooltip
    const div = d3.select(domId).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // append g elements (arc)
    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // append the path to the arc
    g.append('path')
      .attr('d', arc)
      .style('fill', (d) => this.pieColor(d.data.name))
      // show tooltip on hover
      .on('mouseover', (d) => {
        this.showTooltip(div, d.data);
      })
      // hide tooltip on mouse leave
      .on('mouseout', (d) => {
        this.hideTooltip(div);
      })

      .transition()                // for animation
      .ease(d3.easeLinear)         // for animation
      .duration(2000)              // for animation
      .attrTween('d', pieTween);   // for animation

    // append the text(labels)
    g.append('text')
      .transition()               // for animation
      .ease(d3.easeLinear)        // for animation
      .duration(2000)             // for animation
      .attr('transform', (d) => {
        const midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
        const rotateTo = midAngle * 180 / Math.PI;
        return 'translate(' + labelArc.centroid(d)[0] + ',' + labelArc.centroid(d)[1] + ') rotate(-90) rotate(' + rotateTo + ')';
      })
      .attr('dy', '.35em')
      .text((d) => {
        return `${d.data.name}`;
      })
      .style('text-anchor', 'middle');

    // for animation
    function pieTween(b) {
      b.innerRadius = 0;
      const i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
      return (t) => arc(i(t));
    }
  }

  showTooltip(elem, data) {
    elem.transition()
      .duration(200)
      .style('opacity', .9);
    elem.html(data.count + (data.count < 2 ? ' employee' : ' employees'))
      .style('left', (d3.event.pageX) + 'px')
      .style('top', (d3.event.pageY - 28) + 'px');
  }

  hideTooltip(elem) {
    elem.transition()
      .duration(300)
      .style('opacity', 0);
  }
}
