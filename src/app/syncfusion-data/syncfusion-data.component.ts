import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ColumnChooserService,
  ExcelExportService,
  FilterService, FilterSettingsModel,
  GridAllModule, GridComponent,
  PageService, PageSettingsModel, PdfExportService, PdfHeaderQueryCellInfoEventArgs,
  SortService, ToolbarItems, ToolbarService
} from "@syncfusion/ej2-angular-grids";
import {SyncfusionDataService} from "./syncfusion-data.service";
import {Subscription} from "rxjs";
import {TooltipAllModule} from "@syncfusion/ej2-angular-popups";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import {ModifyDetailsComponent} from "./modify-details/modify-details.component";
import {CommonModule} from "@angular/common";
import {Detail} from "./model";

@Component({
  selector: 'app-syncfusion-data',
  standalone: true,
  imports: [
    GridAllModule,
    TooltipAllModule,
    ButtonAllModule,
    ModifyDetailsComponent,
    CommonModule
  ],
  templateUrl: './syncfusion-data.component.html',
  styleUrl: './syncfusion-data.component.scss',
  providers: [PdfExportService, ToolbarService, ColumnChooserService, PageService, FilterService, SortService, ExcelExportService]
})
export class SyncfusionDataComponent implements OnInit, OnDestroy {
  public shareData$: Subscription = new Subscription();
  public closePageDetails$: Subscription = new Subscription();
  public addOrUpdateRecordDetails$: Subscription = new Subscription();
  public data: Detail[] = [];
  public selectedRecordDetails?: Detail;
  public initialPageSettings: PageSettingsModel = {};
  public gridToolbarOptions: ToolbarItems[] = ['ExcelExport', 'CsvExport', 'PdfExport', 'Print', 'ColumnChooser'];
  @ViewChild('gridReference')
  public gridReference?: GridComponent;
  public addOrUpdateDetailsPageVisibility: boolean = false;
  public filterOptions: FilterSettingsModel = {
    mode: 'Immediate'
  };

  constructor(private syncfusionDataService: SyncfusionDataService) {
  }

  ngOnInit() {
    this.initialPageSettings = { pageSizes: true, pageCount: 4 };
    this.shareData$ = this.syncfusionDataService.shareData$.subscribe((data: Detail[]) => {
      if (data) {
        this.data = data;
        if (this.gridReference) {
          this.gridReference.emptyRecordTemplate = 'No Records To Display.'
        }
      }
    });
    this.closePageDetails$ = this.syncfusionDataService.closePageDetails$.subscribe((data: boolean) => {
      if (data) {
        this.addOrUpdateDetailsPageVisibility = false;
        document.body.style.overflow = 'scroll';
      }
    });
    this.addOrUpdateRecordDetails$ = this.syncfusionDataService.addOrUpdateRecordDetails$.subscribe((data: string) => {
      if (data && data !== '') {
        this.addOrUpdateDetailsPageVisibility = false;
        document.body.style.overflow = 'scroll';
        if (this.gridReference) {
          this.gridReference?.refresh();
          this.syncfusionDataService.displayToast(data)
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
    if (this.closePageDetails$) {
      this.closePageDetails$.unsubscribe();
    }
    if (this.addOrUpdateRecordDetails$) {
      this.addOrUpdateRecordDetails$.unsubscribe();
    }
  }

  openAddDetailPage() {
    this.addOrUpdateDetailsPageVisibility = true;
    document.body.style.overflow = 'hidden';
    this.selectedRecordDetails = undefined;
  }

  onToolbarClick(event: ClickEventArgs) {
    if (this.gridReference) {
      this.syncfusionDataService.gridToolbarClickEvents(event, this.gridReference, 'Records', 480);
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

  openUpdateDetailPage(detail: Detail) {
    this.addOrUpdateDetailsPageVisibility = true;
    document.body.style.overflow = 'hidden';
    this.selectedRecordDetails = detail;
  }

  onStandardGridExportComplete() {
    this.gridReference?.showColumns(['Action']);
  }
}
