import { Component, OnInit } from '@angular/core';
import feature from 'topojson-client/src/feature';
import tntopojson from '../../../assets/map/tn2-topo.json';
// import {
//   select,
//   json,
//   geoPath,
//   geoMercator,
//   zoom,
//   event,
//   mouse,
//   html,
// } from 'd3';
import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';

@Component({
  selector: 'app-tamilnadudistrictmap',
  templateUrl: './tamilnadudistrictmap.component.html',
  styleUrls: ['./tamilnadudistrictmap.component.css'],
})
export class TamilnadudistrictmapComponent implements OnInit {
  patientDetails: any;
  constructor(private covidTrackingService: CovidtrackingService) {}
  apiBaseUrlHttps = environment.baseUrlHttps;
  loaderMap: boolean = false;
  refreshApi: boolean = false;
  TamilnaduTopoJsonLink: any =
    'https://www.covid19india.org/maps/tamilnadu.json';
  ngOnInit(): any {
    this.EnrolledPatientDetails();
  }
  EnrolledPatientDetails() {
    this.loaderMap = true;
    this.refreshApi = false;
    this.covidTrackingService.retrieveEnrollPatientDetails().subscribe(
      (response: any) => {
        this.patientDetails = response.result;
        this.loaderMap = false;
        if (this.patientDetails) {
          let details: any = this.patientDetails;
          this.toolTipWithColorD3(details);
        }
      },
      (error: any) => {
        this.loaderMap = false;
        this.refreshApi = true;
      }
    );
  }
  toolTipWithColorD3(InfoAboutEnrollPatient: any): any {
    const svg = d3.select('svg.maptn');
    // Drop Shadow
    var filter = svg
      .append('defs')
      .append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%');
    filter
      .append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 2)
      .attr('result', 'blur');
    filter
      .append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 2)
      .attr('dy', 2)
      .attr('result', 'offsetBlur');
    var feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'offsetBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    const g = svg.append('g');
    Promise.all([
      d3.json(`${this.apiBaseUrlHttps}/stockreport/district`),
      d3.json(this.TamilnaduTopoJsonLink),
    ]).then(([serverData, topojsonData]) => {
      const TamilNadu = feature(
        topojsonData,
        topojsonData.objects.districts
      );
      const projection: any = d3.geoMercator().fitExtent(
        [
          [0, 0],
          [460, 580],
        ],
        TamilNadu
      );
      const pathGenerator = d3.geoPath().projection(projection);
      function ColorChange(TopoJsonInfoForColor: any) {
        let TopoJsonDistrictName: any =
          TopoJsonInfoForColor.properties.district;
        let DynamicInfoForColorChange: any = serverData.result;
        let SingleDistrict: any = DynamicInfoForColorChange.filter(
          (infoAboutDistrict: any) =>
            TopoJsonDistrictName === infoAboutDistrict.district.name
        );
        if (SingleDistrict) {
          let PopulationCount: any;
          let AvailableStock: any;
          let AvailableDoctorStock: any;
          SingleDistrict.forEach((particular: any) => {
            if (particular.warehouse_inventory) {
              AvailableStock = particular.warehouse_inventory.total_available;
              if (AvailableStock) {
                AvailableStock = parseInt(AvailableStock);
              }
            }
            if (particular.doctor_inventory) {
              AvailableDoctorStock =
                particular.doctor_inventory.total_available;
              if (AvailableDoctorStock) {
                AvailableDoctorStock = parseInt(AvailableDoctorStock);
              }
            }
            if (particular.district) {
              PopulationCount = particular.district.population;
              if (PopulationCount) {
                PopulationCount = parseInt(PopulationCount);
              }
            }
          });
          if (!AvailableStock) {
            AvailableStock = 0;
          }
          if (!AvailableDoctorStock) {
            AvailableDoctorStock = 0;
          }
          if (!PopulationCount) {
            PopulationCount = 0;
          }
          let TotalInventoryAvailableStock: any =
            AvailableStock + AvailableDoctorStock;
          if (TotalInventoryAvailableStock && PopulationCount) {
            let FiftyPercentage = Math.floor((50 / 100) * PopulationCount);
            let SeventyFivePercentage = Math.floor(
              (75 / 100) * PopulationCount
            );
            let NinetyPercentage = Math.floor((90 / 100) * PopulationCount);
            if (TotalInventoryAvailableStock < FiftyPercentage) {
              SingleDistrict[0].Color = '#FF0000';
              return '#FF0000'; //red
            } else if (
              TotalInventoryAvailableStock >= FiftyPercentage &&
              TotalInventoryAvailableStock < SeventyFivePercentage
            ) {
              SingleDistrict[0].Color = '#FA6400';
              return '#FA6400'; //orange
            } else if (
              TotalInventoryAvailableStock >= SeventyFivePercentage &&
              TotalInventoryAvailableStock < NinetyPercentage
            ) {
              SingleDistrict[0].Color = '#F7B500';
              return '#F7B500'; // yellow
            }
            SingleDistrict[0].Color = '#008000';
            return '#008000'; // green
          } else {
            SingleDistrict[0].Color = 'white';
            return 'white';
          }
        }
      }
      g.selectAll('path')
        .data(TamilNadu.features)
        .enter()
        .append('path')
        .attr('class', 'State')
        .attr('cursor', 'pointer')
        .attr('d', pathGenerator)
        .style('filter', 'url(#drop-shadow)')
        .attr('fill', ColorChange)
        .on('mouseover', function (JsonTopo: any) {
          if (JsonTopo.properties.district) {
            let TopoJsonDistrictName: any = JsonTopo.properties.district;
            let DynamicInfoAboutDistricts: any = serverData.result;
            let ParticularDistrictDetails: any = DynamicInfoAboutDistricts.filter(
              (DistrictInfo: any) =>
                TopoJsonDistrictName === DistrictInfo.district.name
            );
            if (ParticularDistrictDetails) {
              let TotalRequired: any;
              let TotalRequirdDoctors: any;
              let NameOfDistrict: any;
              let IssuedLiveData: any;
              let IssuedLiveDataDoctor: any;
              let EnrolledPatient: any;
              let TotalPatient: any;
              let PopulationValue: any;
              let DistrictColor: any;
              ParticularDistrictDetails.forEach(
                (InformationAboutStocks: any) => {
                  if (InformationAboutStocks.Color) {
                    DistrictColor = InformationAboutStocks.Color;
                  }
                  if (InformationAboutStocks.warehouse_inventory) {
                    let Available =
                      InformationAboutStocks.warehouse_inventory
                        .total_available;
                    if (Available) {
                      IssuedLiveData = parseInt(Available);
                    }
                    let Damaged =
                      InformationAboutStocks.warehouse_inventory.total_damaged;
                    let Suspended =
                      InformationAboutStocks.warehouse_inventory
                        .total_suspended;
                    let Dispatched =
                      InformationAboutStocks.warehouse_inventory
                        .total_dispatched;
                    TotalRequired =
                      parseInt(Available) +
                      parseInt(Damaged) +
                      parseInt(Suspended) +
                      parseInt(Dispatched);
                  }
                  if (InformationAboutStocks.doctor_inventory) {
                    let AvailableDoctorsStock =
                      InformationAboutStocks.doctor_inventory.total_available;
                    if (AvailableDoctorsStock) {
                      IssuedLiveDataDoctor = parseInt(AvailableDoctorsStock);
                    }
                    let Damaged =
                      InformationAboutStocks.doctor_inventory.total_damaged;
                    let Suspended =
                      InformationAboutStocks.doctor_inventory.total_suspended;
                    let Dispatched =
                      InformationAboutStocks.doctor_inventory.total_dispatched;
                    TotalRequirdDoctors =
                      parseInt(AvailableDoctorsStock) +
                      parseInt(Damaged) +
                      parseInt(Suspended) +
                      parseInt(Dispatched);
                  }
                  if (InformationAboutStocks.district) {
                    NameOfDistrict = InformationAboutStocks.district.name;
                    PopulationValue =
                      InformationAboutStocks.district.population;
                    let FetchDistrictForEnrollPatient: any = InfoAboutEnrollPatient.filter(
                      (element: any) =>
                        parseInt(element.district.id) ===
                        parseInt(InformationAboutStocks.district.id)
                    );
                    if (FetchDistrictForEnrollPatient) {
                      FetchDistrictForEnrollPatient.forEach(
                        (PatientInfo: any) => {
                          if (PatientInfo.enrolled_patients) {
                            EnrolledPatient = parseInt(
                              PatientInfo.enrolled_patients
                            );
                          }
                          if (PatientInfo.district) {
                            TotalPatient = parseInt(
                              PatientInfo.district.population
                            );
                          }
                        }
                      );
                    }
                  }
                }
              );
              if (!IssuedLiveData) {
                IssuedLiveData = 0;
              }
              if (!IssuedLiveDataDoctor) {
                IssuedLiveDataDoctor = 0;
              }
              if (!TotalRequired) {
                TotalRequired = 0;
              }
              if (!TotalRequirdDoctors) {
                TotalRequirdDoctors = 0;
              }
              if (!EnrolledPatient) {
                EnrolledPatient = 0;
              }
              if (!TotalPatient) {
                TotalPatient = 0;
              }
              if (!PopulationValue) {
                PopulationValue = 0;
              }
              let OverallStockFromWarehouseAndDoctorInventory: any =
                IssuedLiveData + IssuedLiveDataDoctor;
              // Population
              PopulationValue = PopulationValue.toString();
              let lastThree: any = PopulationValue.substring(
                PopulationValue.length - 3
              );
              let otherNumbers: any = PopulationValue.substring(
                0,
                PopulationValue.length - 3
              );
              if (otherNumbers != '') lastThree = ',' + lastThree;
              let PopulationValueFormat: any =
                otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
              // Issued Stock
              OverallStockFromWarehouseAndDoctorInventory = OverallStockFromWarehouseAndDoctorInventory.toString();
              let last: any = OverallStockFromWarehouseAndDoctorInventory.substring(
                OverallStockFromWarehouseAndDoctorInventory.length - 3
              );
              let other: any = OverallStockFromWarehouseAndDoctorInventory.substring(
                0,
                OverallStockFromWarehouseAndDoctorInventory.length - 3
              );
              if (other != '') last = ',' + last;
              let OverallStockFromWarehouseAndDoctorInventoryFormat: any =
                other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last;
              // Enrolled
              EnrolledPatient = EnrolledPatient.toString();
              let Three: any = EnrolledPatient.substring(
                EnrolledPatient.length - 3
              );
              let Numbers: any = EnrolledPatient.substring(
                0,
                EnrolledPatient.length - 3
              );
              if (Numbers != '') Three = ',' + Three;
              let EnrolledPatientFormat: any =
                Numbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + Three;
              // Tooltip
              d3.select('#colorbox1').style('color', DistrictColor);
              d3.select('#colorbox2').style('color', DistrictColor);
              d3.select('#colorbox3').style('color', DistrictColor);
              d3.select('#colorbox4').style('color', DistrictColor);
              d3.select('#name').text(NameOfDistrict);
              d3.select('#stockissued').text(
                OverallStockFromWarehouseAndDoctorInventoryFormat
              );
              d3.select('#totalrequired').text(PopulationValueFormat);
              d3.select('#patient').text(EnrolledPatientFormat);
              d3.select('#population').text(PopulationValueFormat);
              d3.select('#tooltip')
                .style('display', 'block')
                .style('opacity', 0.8);
            }
          }
        })
        .on('mouseout', function () {
          d3.select('#tooltip').style('opacity', 0);
        });
      // Legend
      d3.select('#titleLegend')
        .append('b')
        .text('Stock Units Availability (In %) For The Population')
        .style('font-size', '17px')
        .style('fill', 'black');
      const ColorInformation: any = [
        { color: '#FF0000', value: 0 },
        { color: '#FF0000', value: 50 },
        { color: '#FA6400', value: 51 },
        { color: '#FA6400', value: 75 },
        { color: '#F7B500', value: 76 },
        { color: '#F7B500', value: 90 },
        { color: '#008000', value: 91 },
        { color: '#008000', value: 100 },
      ];
      let extent: any = d3.extent(ColorInformation, (d: any) => d.value);
      let padding = 10;
      let width = 540;
      let innerWidth = width - padding * 3;
      let barHeight = 18;
      let xScale = d3.scaleLinear().range([0, innerWidth]).domain(extent);
      let Zero: any = ColorInformation.filter((item: any) => item.value === 0);
      let Fifty: any = ColorInformation.filter(
        (item: any) => item.value === 50
      );
      let SeventyFive: any = ColorInformation.filter(
        (item: any) => item.value === 75
      );
      let ninenty: any = ColorInformation.filter(
        (item: any) => item.value === 90
      );
      let hundred: any = ColorInformation.filter(
        (item: any) => item.value === 100
      );
      let tempArray: any;
      tempArray = [...Zero, ...Fifty, ...SeventyFive, ...ninenty, ...hundred];
      let xTicks: any = tempArray.map((d: any) => d.value);
      let format: any = function (d: any) {
        return d + '%';
      };
      let xAxis: any = d3
        .axisBottom(xScale)
        .tickSize(barHeight * 1.5)
        .tickFormat(format)
        .tickValues(xTicks);
      let svg = d3.select('#legend').append('svg').attr('width', width);
      let g2 = svg
        .append('g')
        .attr('transform', 'translate(' + padding + ', 0)');
      let defs = svg.append('defs');
      let linearGradient = defs
        .append('linearGradient')
        .attr('id', 'myGradient');
      linearGradient
        .selectAll('stop')
        .data(ColorInformation)
        .enter()
        .append('stop')
        .attr(
          'offset',
          (d: any) =>
            ((d.value - extent[0]) / (extent[1] - extent[0])) * 100 + '%'
        )
        .attr('stop-color', (d: any) => d.color);
      g2.append('rect')
        .attr('width', innerWidth)
        .attr('height', barHeight)
        .style('fill', 'url(#myGradient)');
      g2.append('g').call(xAxis).select('.domain').remove();
    });
  }
}
