import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from 'rxjs';
import {ExcelExportProperties, PdfExportProperties} from "@syncfusion/ej2-grids";
import {GridComponent} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

@Injectable({
  providedIn: 'root',
})
export class SyncfusionDataService {
  public shareData = new Subject<[]>();
  public shareData$ = this.shareData.asObservable();
  constructor(private http: HttpClient) { }

  fetchData() {
    return this.http.get<any>('./assets/JSON/sample-data.json').subscribe({next: data => {
      this.shareData.next(data);
    }});
  }

  gridToolbarClickEvents(args: ClickEventArgs, gridReference: GridComponent, componentName: string, pdfHeadingLeftPosition: number){
    if (args?.item?.text && gridReference ) {
      switch (args['item']['text']) {
        case 'PDF Export':
          this.pdfExportProperties(gridReference, componentName, pdfHeadingLeftPosition);
          break;
        case 'CSV Export':
          const csvExportProperties: ExcelExportProperties = {
            fileName: componentName + '.csv',
            header: {
              headerRows: 2,
              rows: [
                {
                  cells: [{
                    colSpan: gridReference?.getVisibleColumns()?.length, value: componentName
                  }]
                }]
            },
          };
          gridReference?.csvExport(csvExportProperties);
          break;
        case 'Excel Export':
          const excelExportProperties: ExcelExportProperties = {
            header: {
              headerRows: 1,
              rows: [
                {
                  cells: [{
                    colSpan: gridReference?.getVisibleColumns()?.length, value: componentName,
                    style: {fontSize: 16, hAlign: 'Center', bold: true}
                  }]
                }]
            },
            fileName: componentName + '.xlsx'
          };
          gridReference?.excelExport(excelExportProperties);
          break;
      }
    }

  }

  pdfExportProperties(gridReference: GridComponent, componentName: string, positionLeft: number){
    let pdfExportProperties: PdfExportProperties  = {
      fileName: componentName + ".pdf",
      pageOrientation: 'Landscape',
      header: {
        fromTop: 0,
        height: 50,
        contents: [
          {
            type: 'Text',
            value: componentName,
            position: {x: positionLeft, y: 0},
            style: {fontSize: 20},
          }
        ]
      }
    };
    gridReference.pdfExport(pdfExportProperties);
  }
}
