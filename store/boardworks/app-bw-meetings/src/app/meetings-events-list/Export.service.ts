import { IExport } from "./IExport";
import { Injectable } from "@angular/core";

@Injectable()
export class ExportService {
  constructor() {}
  ExportToCSV(exportConfig: IExport) {
    let fileName: any = "ExportCSV.csv";
    this.ConvertDataToCSVFile(
      exportConfig.columnHeaders,
      exportConfig.data,
      exportConfig.columnHeaderNotToBeIncluded,
      fileName
    );
  }
  ConvertDataToCSVFile(
    HeaderColumns: any,
    data: any,
    HeaderColumnsIgnored: any,
    filename: any
  ) {
    let csvArray: any;
    const replacer: any = (key: any, value: any) =>
      value === null
        ? ""
        : value.toString().indexOf('"') > 0
        ? value.replace(/"/g, " ")
        : value;
    if (data.length > 0) {
      const header_original: any = Object.keys(data[0]).filter(function (
        item: any
      ) {
        return HeaderColumnsIgnored.indexOf(item) === -1;
      });
      const header_show: any = header_original.map(function (
        value: any,
        index: any
      ) {
        return HeaderColumns.filter(function (item: any) {
          return item.field === value;
        })[0].title;
      });
      let csv: any = data.map((row: any) =>
        header_original
          .map((fieldName: any) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      );
      csv.unshift(header_show.join(","));
      csvArray = csv.join("\r\n");
    } else {
      const header_show: any = HeaderColumns.map(function (
        value: any,
        index: any
      ) {
        return value["title"];
      });
      let csv: any = data.map((row: any) =>
        header_show
          .map((fieldName: any) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      );
      csv.unshift(header_show.join(","));
      csvArray = csv.join("\r\n");
    }
    var a: any = document.createElement("a");
    var blob: any = new Blob([csvArray], { type: "text/csv" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
