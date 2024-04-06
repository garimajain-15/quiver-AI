import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ColumnChooserService,
  ExcelExportService,
  FilterService,
  GridAllModule,
  PageService, PdfExportService,
  SortService, ToolbarService
} from "@syncfusion/ej2-angular-grids";
import {SyncfusionDataService} from "./syncfusion-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-syncfusion-data',
  standalone: true,
  imports: [
    GridAllModule
  ],
  templateUrl: './syncfusion-data.component.html',
  styleUrl: './syncfusion-data.component.scss',
  providers: [PdfExportService, ToolbarService, ColumnChooserService, PageService, FilterService, SortService, ExcelExportService]
})
export class SyncfusionDataComponent implements OnInit, OnDestroy {
  public shareData$: Subscription = new Subscription();
  public data: [] = [];

  constructor(private syncfusionDataService: SyncfusionDataService) {
  }

  ngOnInit() {
    this.shareData$ = this.syncfusionDataService.shareData$.subscribe(data => {
      if (data) {
        this.data = data;
      }
    });
    this.syncfusionDataService.fetchData();
  }

  ngOnDestroy() {
    if (this.shareData$) {
      this.shareData$.unsubscribe();
    }
  }
}
