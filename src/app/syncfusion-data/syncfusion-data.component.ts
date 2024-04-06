import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ColumnChooserService,
  ExcelExportService,
  FilterService,
  GridAllModule, GridComponent,
  PageService, PageSettingsModel, PdfExportService, pdfHeaderQueryCellInfo, PdfHeaderQueryCellInfoEventArgs,
  SortService, ToolbarItems, ToolbarService
} from "@syncfusion/ej2-angular-grids";
import {SyncfusionDataService} from "./syncfusion-data.service";
import {Subscription} from "rxjs";
import {TooltipAllModule} from "@syncfusion/ej2-angular-popups";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

@Component({
  selector: 'app-syncfusion-data',
  standalone: true,
  imports: [
    GridAllModule,
    TooltipAllModule,
    ButtonAllModule
  ],
  templateUrl: './syncfusion-data.component.html',
  styleUrl: './syncfusion-data.component.scss',
  providers: [PdfExportService, ToolbarService, ColumnChooserService, PageService, FilterService, SortService, ExcelExportService]
})
export class SyncfusionDataComponent implements OnInit, OnDestroy {
  public shareData$: Subscription = new Subscription();
  public data: [] = [];
  public initialPageSettings: PageSettingsModel = {};
  public gridToolbarOptions: ToolbarItems[] = ['ExcelExport', 'CsvExport', 'PdfExport', 'Print', 'ColumnChooser'];
  @ViewChild('gridReference')
  public gridReference?: GridComponent;

  constructor(private syncfusionDataService: SyncfusionDataService) {
  }

  ngOnInit() {
    this.initialPageSettings = { pageSizes: true, pageCount: 4 };
    this.shareData$ = this.syncfusionDataService.shareData$.subscribe(data => {
      if (data) {
        this.data = data;
        if (this.gridReference) {
          this.gridReference.emptyRecordTemplate = 'No Records To Display.'
        }
      }
    });
    this.syncfusionDataService.fetchData();
  }

  ngOnDestroy() {
    if (this.shareData$) {
      this.shareData$.unsubscribe();
    }
  }

  openAddDetailPage() {

  }

  onToolbarClick(event: ClickEventArgs) {
    if (this.gridReference) {
      this.syncfusionDataService.gridToolbarClickEvents(event, this.gridReference, 'Details', 480);
    }
  }

  pdfHeaderQueryCellInfo(args: PdfHeaderQueryCellInfoEventArgs) {
    if (args?.cell) {
      const pdfCell: any = args.cell;
      if (pdfCell?.row?.pdfGrid) {
        pdfCell['row']['pdfGrid']['repeatHeader'] = true;
      }
    }
  }
}
