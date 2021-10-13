import { Component, OnInit } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
// import Chart from 'chart.js';
declare var Chart: any;
import 'chartjs-plugin-style';
@Component({
  selector: 'app-combograph',
  templateUrl: './combograph.component.html',
  styleUrls: ['./combograph.component.css'],
})
export class CombographComponent implements OnInit {
  canvas: any;
  ctx: any;
  graphData: any;
  myChart: any;
  canvas2: any;
  ctx2: any;
  myChart2: any;
  loaderGraph: boolean = false;
  refreshApi: boolean = false;

  constructor(private covidTrackingService: CovidtrackingService) {}
  ngOnInit(): void {
    this.ServerSideData();
  }
  ServerSideData() {
    this.loaderGraph = true;
    this.refreshApi = false;
    this.covidTrackingService.getDistrictWisePopulationDetails().subscribe(
      (response: any) => {
        this.graphData = response.result;
        if (this.graphData) {
          this.graphData.sort((a: any, b: any) =>
            a.district.population < b.district.population ? 1 : -1
          );
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
            if (InsideElement.district) {
              let districtDetails = InsideElement.district;
              let ide = districtDetails.id;
              tempId.push(ide);
              let populationInDistricts = districtDetails.population;
              let requiredDoctorsBasedOnPopulation =
                parseInt(populationInDistricts) / 350;
              tempObjPop.population = populationInDistricts;
              tempObjPop.requiredDoctors = Math.floor(
                requiredDoctorsBasedOnPopulation
              );
              tempArrayPopulations.push(tempObjPop);
              let districtName = districtDetails.name;
              tempArrayDistrictNames.push(districtName);
              let districtWards = districtDetails.wards;
              tempArrayWards.push(districtWards);
              let districtVillages = districtDetails.villages;
              tempArrayVillages.push(districtVillages);
              let availableDoctorCount = InsideElement.doctor_count;
              if (availableDoctorCount) {
                tempObjPop.Doctorscount = availableDoctorCount;
              } else {
                tempObjPop.Doctorscount = 0;
              }
            }
            if (
              InsideElement.doctor_count &&
              InsideElement.district.population
            ) {
              let availableDoctors = parseInt(InsideElement.doctor_count);
              let overallPopulations = InsideElement.district.population;
              if (overallPopulations && availableDoctors) {
                if (overallPopulations / availableDoctors != undefined) {
                  let divisior: any = parseInt(overallPopulations) / 350;
                  let FiftyPercentage = Math.floor((50 / 100) * divisior);
                  let SeventyFivePercentage = Math.floor((75 / 100) * divisior);
                  let NinetyPercentage = Math.floor((90 / 100) * divisior);
                  if (availableDoctors < FiftyPercentage) {
                    tempObjPop.doctorColor = '#FF0000'; //red
                  } else if (
                    availableDoctors >= FiftyPercentage &&
                    availableDoctors < SeventyFivePercentage
                  ) {
                    tempObjPop.doctorColor = '#FA6400'; //orange
                  } else if (
                    availableDoctors >= SeventyFivePercentage &&
                    availableDoctors < NinetyPercentage
                  ) {
                    tempObjPop.doctorColor = '#F7B500'; //yellow
                  } else {
                    tempObjPop.doctorColor = '#008000'; //green
                  }
                }
              }
            } else {
              tempObjPop.doctorColor = '#FF0000'; //red
            }
          });
          if (tempArrayDistrictNames && tempArrayPopulations) {
            this.displayGraph(
              tempArrayDistrictNames,
              tempArrayPopulations,
              this.graphData
            );
            this.displayGraph2(tempArrayDistrictNames, tempArrayPopulations);
          }
          this.loaderGraph = false;
        }
      },
      (error) => {
        this.loaderGraph = false;
        this.refreshApi = true;
      }
    );
  }
  displayGraph(DistrictNames: any, Populations: any, GraphData: any) {
    Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.elements.line.tension = 0;
    Chart.defaults.global.tooltips.titleAlign = 'center';
    let PopulationNewArray: any = [];
    let ColorsDependsOnDoctor: any = [];
    if (Populations) {
      Populations.map((e: any) => {
        let x = '-' + e.population;
        PopulationNewArray.push(x);
        ColorsDependsOnDoctor.push(e.doctorColor);
      });
    }
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let effectColors: any = {
      highlight: 'rgba(255, 255, 255, 0.75)',
      shadow: 'rgba(0,0,0,0.15)',
      shadowLeft: 'rgba(0,0,0,0.05)',
      glow: 'rgb(255, 255, 0)',
    };
    let ShadowOffsetX: any = 3;
    let ShadowOffsetY: any = 3;
    let ShadowBlur: any = 20;
    let ShadowColor: any = effectColors.shadow;
    var ChartData: any = {
      labels: DistrictNames,
      datasets: [
        {
          label: 'Population',
          data: PopulationNewArray,
          yAxisID: 'A',
          backgroundColor: '#a0daff',
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 5,
          shadowColor: effectColors.shadowLeft,
        },
      ],
    };
    this.myChart = new Chart(this.ctx, {
      type: 'horizontalBar',
      data: ChartData,
      options: {
        responsive: false,
        scales: {
          xAxes: [
            {
              ticks: {
                display: true,
                callback: function (value: any, index: any, values: any) {
                  if (value) {
                    let stringValue: any = value.toString();
                    value = stringValue.substring(1);
                  }
                  return value;
                },
              },
              gridLines: {
                color: 'black',
                drawOnChartArea: false,
                zeroLineColor: 'black',
                zeroLineWidth: 1,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: true,
                fontColor: 'black',
                fontSize: 14,
              },
              gridLines: {
                display: false,
              },
              id: 'A',
              position: 'left',
            },
          ],
        },
        plugins: {
          datalabels: {
            display: false,
          },
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          displayColors: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          bodyFontColor: 'white',
          titleFontColor: 'white',
          shadowOffsetX: ShadowOffsetX,
          shadowOffsetY: ShadowOffsetY,
          shadowBlur: ShadowBlur,
          shadowColor: ShadowColor,
          custom: function (tooltipModel: any) {
            if (tooltipModel.dataPoints) {
              tooltipModel.titleFontSize = 15;
              let LinesArray: any = tooltipModel.body[0].lines;
              tooltipModel.body[0].lines = [];
              LinesArray.map((item: any, index: any) => {
                if (index === 0) {
                  tooltipModel.beforeBody.push(item);
                } else if (index === 1) {
                  tooltipModel.beforeBody.push(item);
                } else {
                  tooltipModel.body[0].lines.push(item);
                }
              });
            }
          },
          callbacks: {
            label: (tooltipItem: any, data: any) => {
              const datasetLabel =
                data.datasets[tooltipItem.datasetIndex].label || '';
              if (tooltipItem.value === 'NaN') {
                tooltipItem.value = 0;
              }
              let PopulationValue: any = tooltipItem.value;
              PopulationValue = PopulationValue.substring(1);
              if (GraphData) {
                let GraphInfo = GraphData.filter(
                  (Info: any) =>
                    Info.district.population === parseInt(PopulationValue)
                );
                let Wards: any = GraphInfo[0].district.wards;
                let Villages: any = GraphInfo[0].district.villages;
                let Population: any = GraphInfo[0].district.population;
                let RegisteredUsers: any = GraphInfo[0].people_count;
                if (!RegisteredUsers) {
                  RegisteredUsers = 0;
                }
                if (!Wards) {
                  Wards = 0;
                }
                if (!Villages) {
                  Villages = 0;
                }
                if (!Population) {
                  Population = 0;
                }
                // Registered Users
                RegisteredUsers = RegisteredUsers.toString();
                let lastThree1: any = RegisteredUsers.substring(
                  RegisteredUsers.length - 3
                );
                let otherNumbers1: any = RegisteredUsers.substring(
                  0,
                  RegisteredUsers.length - 3
                );
                if (otherNumbers1 != '') lastThree1 = ',' + lastThree1;
                let EnrolledFormat: any =
                  otherNumbers1.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
                  lastThree1;
                // Villages
                Villages = Villages.toString();
                let lastThree2: any = Villages.substring(Villages.length - 3);
                let otherNumbers2: any = Villages.substring(
                  0,
                  Villages.length - 3
                );
                if (otherNumbers2 != '') lastThree2 = ',' + lastThree2;
                let VillagesFormat: any =
                  otherNumbers2.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
                  lastThree2;
                // Population
                Population = Population.toString();
                let lastThree3: any = Population.substring(
                  Population.length - 3
                );
                let otherNumbers3: any = Population.substring(
                  0,
                  Population.length - 3
                );
                if (otherNumbers3 != '') lastThree3 = ',' + lastThree3;
                let PopulationFormat: any =
                  otherNumbers3.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
                  lastThree3;
                // Wards
                Wards = Wards.toString();
                let lastThree4: any = Wards.substring(Wards.length - 3);
                let otherNumbers4: any = Wards.substring(0, Wards.length - 3);
                if (otherNumbers4 != '') lastThree4 = ',' + lastThree4;
                let WardsFormat: any =
                  otherNumbers4.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
                  lastThree4;
                let WardsAndVillagesAlone: any = ` Villages  (${VillagesFormat})  /  Wards  (${WardsFormat})`;
                let Enrolled: any = ` People Enrolled : ${EnrolledFormat}`;
                let PopulationCount: any = ` Total Population : ${PopulationFormat}`;
                return [WardsAndVillagesAlone, '', Enrolled, PopulationCount];
              }
            },
          },
        },
      },
    });
  }
  displayGraph2(DistrictNames: any, DoctorsPopulation: any) {
    let DoctorsAlone: any = [];
    let DoctorsColorsAlone: any = [];
    if (DoctorsPopulation) {
      DoctorsPopulation.forEach((countOfDoctors: any) => {
        DoctorsAlone.push(countOfDoctors.Doctorscount);
        DoctorsColorsAlone.push(countOfDoctors.doctorColor);
      });
    }
    Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.elements.line.tension = 0;
    Chart.defaults.global.tooltips.titleAlign = 'center';
    this.canvas2 = document.getElementById('myChart2');
    this.ctx2 = this.canvas2.getContext('2d');
    let effectColors: any = {
      highlight: 'rgba(255, 255, 255, 0.75)',
      shadow: 'rgba(0,0,0,0.15)',
      glow: 'rgb(255, 255, 0)',
    };
    let ShadowOffsetX: any = 3;
    let ShadowOffsetY: any = 3;
    let ShadowBlur: any = 20;
    let ShadowColor: any = effectColors.shadow;
    var ChartData: any = {
      labels: DistrictNames,
      datasets: [
        {
          label: 'Doctors',
          data: DoctorsAlone,
          backgroundColor: DoctorsColorsAlone,
          yAxisID: 'B',
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          shadowBlur: 5,
          shadowColor: effectColors.shadow,
        },
      ],
    };
    this.myChart2 = new Chart(this.ctx2, {
      type: 'horizontalBar',
      data: ChartData,
      options: {
        responsive: false,
        scales: {
          xAxes: [
            {
              ticks: {
                display: true,
                callback: function (value: any, index: any, values: any) {
                  return value;
                },
              },
              gridLines: {
                color: 'black',
                drawOnChartArea: false,
                zeroLineColor: 'black',
                zeroLineWidth: 1,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: false,
                fontColor: 'black',
                fontSize: 14,
              },
              gridLines: {
                display: false,
              },
              id: 'B',
              position: 'right',
            },
          ],
        },
        plugins: {
          datalabels: {
            display: false,
          },
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          bodyFontColor: 'white',
          titleFontColor: 'white',
          shadowOffsetX: ShadowOffsetX,
          shadowOffsetY: ShadowOffsetY,
          shadowBlur: ShadowBlur,
          shadowColor: ShadowColor,
          custom: function (tooltipModel: any) {
            if (tooltipModel.dataPoints) {
              tooltipModel.titleFontSize = 15;
            }
          },
          callbacks: {
            label: (tooltipItem: any, data: any) => {
              const datasetLabel =
                data.datasets[tooltipItem.datasetIndex].label || '';
              if (tooltipItem.value === 'NaN') {
                tooltipItem.value = 0;
              }
              let Index: any = tooltipItem.index;
              let DoctorsInfo: any = DoctorsPopulation.filter(
                (info: any, index: any) => index === Index
              );
              let AvailableDoctors: any = DoctorsInfo[0].Doctorscount;
              let RequiredDoctors: any = DoctorsInfo[0].requiredDoctors;
              if (!AvailableDoctors) {
                AvailableDoctors = 0;
              }
              if (!RequiredDoctors) {
                RequiredDoctors = 0;
              }
              // Available
              AvailableDoctors = AvailableDoctors.toString();
              let lastThree5: any = AvailableDoctors.substring(
                AvailableDoctors.length - 3
              );
              let otherNumbers5: any = AvailableDoctors.substring(
                0,
                AvailableDoctors.length - 3
              );
              if (otherNumbers5 != '') lastThree5 = ',' + lastThree5;
              let AvailableDoctorsFormat: any =
                otherNumbers5.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
                lastThree5;
              // Required
              RequiredDoctors = RequiredDoctors.toString();
              let lastThree6: any = RequiredDoctors.substring(
                RequiredDoctors.length - 3
              );
              let otherNumbers6: any = RequiredDoctors.substring(
                0,
                RequiredDoctors.length - 3
              );
              if (otherNumbers6 != '') lastThree6 = ',' + lastThree6;
              let RequiredDoctorsFormat: any =
                otherNumbers6.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
                lastThree6;
              let firstValue: any = ` ${datasetLabel} Enrolled : ${AvailableDoctorsFormat}`;
              let secondValue: any = ` ${datasetLabel} Needed : ${RequiredDoctorsFormat}`;
              return [firstValue, secondValue];
            },
          },
        },
      },
    });
  }
}
