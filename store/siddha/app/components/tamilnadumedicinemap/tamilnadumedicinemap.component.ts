import { Component, OnInit } from '@angular/core';
// import * as L from 'leaflet';
import L, { Map } from 'leaflet';
import { tndetails } from 'src/assets/commonmap/geoJsonTamilNadu';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
@Component({
  selector: 'app-tamilnadumedicinemap',
  templateUrl: './tamilnadumedicinemap.component.html',
  styleUrls: ['./tamilnadumedicinemap.component.css'],
})
export class TamilnadumedicinemapComponent implements OnInit {
  map: Map;
  tamilnaduLayer: L.GeoJSON<any>;
  stockDetails: any;
  constructor(private covidTrackingService: CovidtrackingService) {}
  ngOnInit(): void {
    this.getStockWareHouseMedicine();
  }
  getStockWareHouseMedicine() {
    this.covidTrackingService.retrieveStockMedicines().subscribe(
      (response: any) => {
        this.stockDetails = response.result;
        if (this.stockDetails) {
          let details: any = this.stockDetails;
          this.tnMapDynamic(details);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  tnMapDynamic(MedicineDetails: any) {
    let map: any;
    let info: any = new L.Control();
    let tn: any = tndetails;
    map = L.map('map', { zoomControl: false }).setView([11.1271, 78.6569], 7);

    // Info
    // info.onAdd = function (map: any) {
    //   this._div = L.DomUtil.create('div', 'info');
    //   this.update();
    //   return this._div;
    // };
    // info.update = function (props: { Dist_Name: any; Dist_Code: any }) {
    //   let ServerEachDistrictDetails: any;
    //   if (props) {
    //     ServerEachDistrictDetails = MedicineDetails.filter(
    //       (info: any) => info.district.name === props.Dist_Name
    //     );
    //   }
    //   this._div.innerHTML = ServerEachDistrictDetails
    //     ? '<b>' +
    //       ServerEachDistrictDetails[0].district.name +
    //       ':</b> &nbsp;&nbsp;' +
    //       ServerEachDistrictDetails[0].district.population +
    //       '&nbsp;' +
    //       'people'
    //     : '';
    // };
    // info.addTo(map);

    // Setting Color
    function getColor(d: any) {
      return d > 670
        ? 'red'
        : d > 660
        ? 'green'
        : d > 650
        ? 'yellow'
        : d > 640
        ? 'blue'
        : d > 630
        ? 'pink'
        : d > 610
        ? 'orange'
        : d > 600
        ? 'purple'
        : 'brown';
    }

    // Color
    function Style(feature: { properties: { Dist_Code: any } }) {
      return {
        fillColor: getColor(feature.properties.Dist_Code),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: 3,
        fillOpacity: 0.7,
      };
    }

    // Highlight
    function highlightFeature(e: { target: any }) {
      var layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      info.update(layer.feature.properties);
    }

    // Global GeoJson Variable
    let tamilnaduLayer: any;

    // Reset Highlight
    function resetHighlight(e: { target: any }) {
      tamilnaduLayer.resetStyle(e.target);
      info.update();
    }

    // Zoom Outerlined
    function zoomToFeature(e: { target: { getBounds: () => any } }) {
      map.fitBounds(e.target.getBounds());
    }

    // Events
    function onEachFeature(feature: any, layer: any) {
      layer.setStyle({
        fillColor: getColor(feature.properties.Dist_Code),
      });
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    }

    // popup

    // var marker = L.marker([9.9533, 78.0195]).addTo(map);
    // var tooltipPopup: L.Popup;
    // marker.on('mouseover', function (e) {
    //   tooltipPopup = L.popup({ offset: L.point(0, -5) });
    //   tooltipPopup.setContent('Hello');
    //   tooltipPopup.setLatLng(e.target.getLatLng());
    //   tooltipPopup.openOn(map);
    // });
    // marker.on('mouseout', function (e) {
    //   map.closePopup(tooltipPopup);
    // });

    // Dynamic Data Geo Json

    tamilnaduLayer = L.geoJSON(tn, {
      style: {
        fillColor: 'skyblue',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
      },
      onEachFeature: onEachFeature,
    }).addTo(map);

    //Legend
    // var legend = new L.Control();
    // legend.setPosition('bottomright');
    // legend.onAdd = function (map: any) {
    //   var div = L.DomUtil.create('div', 'info legend'),
    //     grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    //     labels: any = [],
    //     from: any,
    //     to: any;
    //   for (var i = 0; i < grades.length; i++) {
    //     from = grades[i];
    //     to = grades[i + 1];
    //     labels.push(
    //       '<i style="background:' +
    //         getColor(from + 1) +
    //         '"></i> ' +
    //         from +
    //         (to ? '&ndash;' + to : '+')
    //     );
    //   }
    //   div.innerHTML = labels.join('<br>');
    //   return div;
    // };
    // legend.addTo(map);

    // Dynamic ForEach

    // var highlight: any,
    //   delay = 0;

    // tamilnaduLayer.eachLayer(function (layer: any) {
    //   console.log('Layer', layer);
    //   layer = { target: layer };
    //   delay = delay + 3000;
    //   setTimeout(function () {
    //     if (highlight) {
    //       resetHighlight(highlight);
    //     }
    //     highlightFeature(layer);
    //     highlight = layer;
    //   }, delay);
    // });
  }
}
