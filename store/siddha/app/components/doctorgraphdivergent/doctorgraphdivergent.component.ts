import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
@Component({
  selector: 'app-doctorgraphdivergent',
  templateUrl: './doctorgraphdivergent.component.html',
  styleUrls: ['./doctorgraphdivergent.component.css'],
})
export class DoctorgraphdivergentComponent implements OnInit {
  canvas: any;
  ctx: any;
  graphData: any;
  myChart: any;

  constructor(private covidTrackingService: CovidtrackingService) {}
  ngOnInit(): void {
    this.ServerSideData();
  }
  ServerSideData() {
    this.covidTrackingService.getDistrictWisePopulationDetails().subscribe(
      (response: any) => {
        this.graphData = response.result;
        if (this.graphData) {
          this.graphData.sort((a: any, b: any) =>
            a.district.population < b.district.population ? 1 : -1
          );
          let tempArrayDoctors: any = [];
          let tempArrayRegisteredUsers: any = [];
          let tempArrayDistrictNames: any = [];
          let tempArrayPopulations: any = [];
          let tempArrayVillages: any = [];
          let tempArrayWards: any = [];
          let tempId: any = [];
          let counts: any;
          this.graphData.map((InsideElement: any) => {
            let tempObjPop: any = {};
            let registeredUserCount = InsideElement.people_count;
            if (registeredUserCount) {
              tempArrayRegisteredUsers.push(registeredUserCount);
            }
            let availableDoctorCount = InsideElement.doctor_count;
            if (availableDoctorCount) {
              tempArrayDoctors.push(availableDoctorCount);
            }
            if (InsideElement.district) {
              let districtDetails = InsideElement.district;
              let ide = districtDetails.id;
              tempId.push(ide);
              let populationInDistricts = districtDetails.population;
              tempObjPop.population = populationInDistricts;
              tempArrayPopulations.push(tempObjPop);
              let districtName = districtDetails.name;
              tempArrayDistrictNames.push(districtName);
              let districtWards = districtDetails.wards;
              tempArrayWards.push(districtWards);
              let districtVillages = districtDetails.villages;
              tempArrayVillages.push(districtVillages);
            }
            if (
              InsideElement.doctor_count &&
              InsideElement.district.population
            ) {
              let availableDoctors = InsideElement.doctor_count;
              let overallPopulations = InsideElement.district.population;
              if (overallPopulations && availableDoctors) {
                if (overallPopulations / availableDoctors != undefined) {
                  counts = overallPopulations / availableDoctors;
                  if (counts >= 0 && counts <= 350) {
                    tempObjPop.doctorColor = 'green';
                  } else if (counts >= 350 && counts <= 750) {
                    tempObjPop.doctorColor = 'yellow';
                  } else if (counts >= 750 && counts <= 1100) {
                    tempObjPop.doctorColor = 'orange';
                  } else {
                    tempObjPop.doctorColor = 'red';
                  }
                }
              }
            } else {
              tempObjPop.doctorColor = 'red';
            }
          });
          if (tempArrayDistrictNames && tempArrayPopulations) {
            let Icon = '\uf0c8';
            this.displayGraph(
              tempArrayDistrictNames,
              tempArrayRegisteredUsers,
              tempArrayPopulations,
              Icon,
              this.graphData
            );
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  displayGraph(
    DistrictNames: any,
    RegisteredUsers: any,
    Populations: any,
    icons: any,
    GraphData: any
  ) {
    Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.elements.line.tension = 0;
    Chart.controllers.customBar = Chart.controllers.bar.extend({
      code: null,
      colorDoctor: null,
    });
    let PopulationNewArray: any = [];
    let DoctorColorNewArray: any = [];
    let temp: any = [];
    if (Populations) {
      Populations.map((e: any) => {
        let x = '-' + e.population;
        PopulationNewArray.push(x);
        DoctorColorNewArray.push(e.doctorColor);
        temp.push(e.population);
      });
    }
    console.log('Populations', PopulationNewArray);
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    var ChartData: any = {
      labels: DistrictNames,
      datasets: [
        {
          label: 'Registered Users',
          data: temp,
          yAxisID: 'A',
          backgroundColor: 'palegreen',
          // borderColor: 'green',
          // borderWidth: { top: 0, right: 2, bottom: 0, left: 0 },
        },
        {
          label: 'Populations',
          data: PopulationNewArray,
          yAxisID: 'A',
          backgroundColor: '#a0daff',
          // code: icons,
          // colorDoctor: DoctorColorNewArray,
        },
      ],
    };
    this.myChart = new Chart(this.ctx, {
      type: 'horizontalBar',
      data: ChartData,
      options: {
        responsive: false,
        layout: {
          padding: 24,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: true,
              },
              gridLines: {
                display: false,
              },
              // stacked: true,
            },
          ],
          yAxes: [
            {
              ticks: {
                display: true,
              },
              gridLines: {
                display: false,
              },
              id: 'A',
              position: 'left',
              stacked: true,
            },
          ],
        },
        plugins: {
          datalabels: {
            // align: 'end',
            // anchor: 'end',
            display: false,
            // color: (value: any) => {
            //   if (value.dataset.colorDoctor) {
            //     return value.dataset.colorDoctor;
            //   }
            // },
            // font: {
            //   family: 'FontAwesome',
            //   size: 20,
            // },
            // formatter: function (_value: any, context: any) {
            //   let contextValue = context.dataset.label;
            //   if (contextValue.includes('Populations')) {
            //     let codeIcon: any = context.dataset.code;
            //     return `${codeIcon}`;
            //   } else {
            //     return '';
            //   }
            // },
          },
        },
        // tooltips: {
        //   enabled: true,
        //    mode: 'single',
        //   backgroundColor: 'lightcoral',
        //   bodyFontColor: 'white',
        //   titleFontColor: 'white',
        // custom: function (tooltipModel: any) {
        //   tooltipModel.backgroundColor =
        //     DoctorColorNewArray[tooltipModel.dataPoints[0].index];
        // },
        // callbacks: {
        //   label: (tooltipItem: any, data: any) => {
        //     const datasetLabel =
        //       data.datasets[tooltipItem.datasetIndex].label || '';
        //     if (tooltipItem.value === 'NaN') {
        //       tooltipItem.value = 0;
        //     }
        //     if (GraphData) {
        //       let GraphInfo = GraphData.filter(
        //         (Info: any) =>
        //           Info.district.population === parseInt(tooltipItem.value)
        //       );
        //       let Wards = GraphInfo[0].district.wards;
        //       let Villages = GraphInfo[0].district.villages;
        //       let DoctorsCount = GraphInfo[0].doctor_count;
        //       if (!DoctorsCount) {
        //         DoctorsCount = 0;
        //       }
        //       return `${datasetLabel}:${parseInt(
        //         tooltipItem.value
        //       )}\n  Wards:${Wards}\n  Villages:${Villages} \n Doctors:${DoctorsCount}`;
        //     }
        //   },
        // },
        //  },
      },
    });
  }
  // loadingGraph() {
  //   var canvas: any = document.getElementById('chart');
  //   new Chart(canvas, {
  //     type: 'horizontalBar',
  //     data: {
  //       labels: ['a', 'b', 'c', 'd', 'e'],
  //       datasets: [
  //         {
  //           label: 'A',
  //           yAxisID: 'A',
  //           data: [100, 90, 80, 70, 60],
  //           backgroundColor: 'blue',
  //         },
  //         {
  //           label: 'B',
  //           yAxisID: 'A',
  //           data: [-100, -90, -80, -70, -60],
  //           backgroundColor: 'red',
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [
  //           {
  //             id: 'A',
  //             position: 'left',
  //           },
  //         ],
  //       },
  //     },
  //   });
  // }
}
