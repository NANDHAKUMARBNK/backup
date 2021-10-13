import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
import Chart from 'chart.js';
declare var $: any;
@Component({
  selector: 'app-graphpopulation',
  templateUrl: './graphpopulation.component.html',
  styleUrls: ['./graphpopulation.component.css'],
})
export class GraphpopulationComponent implements OnInit {
  public barChartOptions: any = {
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
            fontFamily: 'FontAwesome',
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        display: false,
        align: 'end',
        anchor: 'end',
        enabled: true,
        useHTML: true,
      },
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const datasetLabel =
            data.datasets[tooltipItem.datasetIndex].label || '';
          if (tooltipItem.value === 'NaN') {
            tooltipItem.value = 0;
          }
          return `${datasetLabel}:${parseInt(tooltipItem.value)}`;
        },
      },
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: any = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: any = [
    {
      data: [],
      label: 'RegisteredUsers',
      stack: 'a',
    },
    {
      data: [],
      label: 'Population',
      stack: 'a',
    },
  ];
  public barChartColors: any = [
    {
      backgroundColor: 'palegreen',
      borderColor: 'green',
      borderWidth: { top: 0, right: 2, bottom: 0, left: 0 },
    },
    {
      backgroundColor: 'pink',
    },
  ];
  graphData: any;
  constructor(private covidTrackingService: CovidtrackingService) {}

  ngOnInit() {
    this.getDistrictWiseGraphData();
  }
  getDistrictWiseGraphData() {
    this.covidTrackingService.getDistrictWisePopulationDetails().subscribe(
      (response: any) => {
        this.graphData = response.result;
        if (this.graphData) {
          let tempArrayDoctors: any = [];
          let tempArrayRegisteredUsers: any = [];
          let tempArrayDistrictNames: any = [];
          let tempArrayPopulations: any = [];
          let tempArrayVillages: any = [];
          let tempArrayWards: any = [];
          this.graphData.map((InsideElement: any) => {
            let registeredUserCount = InsideElement.people_count;
            tempArrayRegisteredUsers.push(registeredUserCount);
            let availableDoctorCount = InsideElement.doctor_count;
            tempArrayDoctors.push(availableDoctorCount);
            if (InsideElement.district) {
              let districtDetails = InsideElement.district;
              let populationInDistricts = districtDetails.population;
              tempArrayPopulations.push(populationInDistricts);
              let districtName = districtDetails.name;
              tempArrayDistrictNames.push(districtName);
              let districtWards = districtDetails.wards;
              tempArrayWards.push(districtWards);
              let districtVillages = districtDetails.villages;
              tempArrayVillages.push(districtVillages);
            }
          });
          this.barChartLabels = tempArrayDistrictNames;
          this.barChartData[0].data = tempArrayRegisteredUsers;
          this.barChartData[1].data = tempArrayPopulations;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
