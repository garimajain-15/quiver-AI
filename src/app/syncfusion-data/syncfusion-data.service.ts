import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from 'rxjs';
import {ExcelExportProperties, PdfExportProperties} from "@syncfusion/ej2-grids";
import {GridComponent} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import {Detail} from "./model";
import {ToastUtility} from "@syncfusion/ej2-notifications";

@Injectable({
  providedIn: 'root',
})
export class SyncfusionDataService {
  public shareData = new Subject<Detail[]>();
  public shareData$ = this.shareData.asObservable();
  public closePageDetails = new Subject<boolean>();
  public closePageDetails$ = this.closePageDetails.asObservable();
  public allRecordList? : Detail[];
  public addOrUpdateRecordDetails = new Subject<string>();
  public addOrUpdateRecordDetails$ = this.addOrUpdateRecordDetails.asObservable();

  constructor(private http: HttpClient) { }

  fetchData() {
    return this.http.get<any>('./assets/JSON/sample-data.json').subscribe({next: data => {
      this.allRecordList = data;
      this.shareData.next(data);
    }});
  }

  gridToolbarClickEvents(args: ClickEventArgs, gridReference: GridComponent, componentName: string, pdfHeadingLeftPosition: number){
    if (args?.item?.text && gridReference ) {
      const isColumnOtherThanActionVisible = this.checkGridColumnVisibility(gridReference, args['item']['text']);
      if (isColumnOtherThanActionVisible) {
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

  addOrUpdateDetails(detailToAddOrUpdate: Detail) {
    if (detailToAddOrUpdate) {
      let isAddedOrUpdateDetail: string = '';
      if (this.allRecordList && this.allRecordList.length > 0) {
        const existingRecordIndex = this.allRecordList.findIndex((detailData: Detail) => {
          return detailToAddOrUpdate?.y_seq === detailData?.y_seq;
        });
        if (existingRecordIndex !== -1) {
          this.allRecordList[existingRecordIndex] = detailToAddOrUpdate;
          isAddedOrUpdateDetail = 'Updated';
        } else {
          this.allRecordList.unshift(detailToAddOrUpdate);
          isAddedOrUpdateDetail = 'Added';
        }
        this.shareData.next(this.allRecordList);
        this.addOrUpdateRecordDetails.next(isAddedOrUpdateDetail)
      }
    }
  }

  closeAddOrUpdatePage(confirmation: boolean) {
    this.closePageDetails.next(confirmation);
  }

  displayToast(message: string) {
    ToastUtility.show({
      title: 'Success',
      content: 'Details has been successfully ' + message + '.',
      timeOut: 2000,
      position: {X: 'Center', Y: 'Bottom'},
      showCloseButton: true,
      cssClass: 'e-toast-success'
    });
  }

  checkGridColumnVisibility(gridReference: GridComponent, toolbarActionType: string) {
    let visibility: boolean = true;
    if (toolbarActionType === "PDF Export" || toolbarActionType === "Print" ||
      toolbarActionType === "CSV Export" || toolbarActionType === "Excel Export") {
      gridReference.hideColumns(['Action']);
      if (gridReference.getVisibleColumns().length > 0) {
        visibility = true;
      } else {
        gridReference.showColumns(['Action']);
        visibility = false;
        this.displayInformationToast(toolbarActionType);
      }
    }
    return visibility;
  }

  displayInformationToast(toolbarActionType: string) {
    ToastUtility.show({
      content: 'Please select at least one column other than the action column to ' + toolbarActionType + '.',
      timeOut: 2000,
      position: {X: 'Center', Y: 'Bottom'},
      showCloseButton: true,
      cssClass: 'e-toast-info'
    });
  }
}
