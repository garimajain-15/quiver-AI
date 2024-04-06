import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TooltipAllModule} from "@syncfusion/ej2-angular-popups";
import {ProgressButtonAllModule} from "@syncfusion/ej2-angular-splitbuttons";
import {NumericTextBoxAllModule, TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SyncfusionDataService} from "../syncfusion-data.service";
import {NgIf} from "@angular/common";
import {Detail} from "../model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-modify-details',
  standalone: true,
  imports: [
    TooltipAllModule,
    ProgressButtonAllModule,
    TextBoxAllModule,
    FormsModule,
    ReactiveFormsModule,
    NumericTextBoxAllModule,
    NgIf
  ],
  templateUrl: './modify-details.component.html',
  styleUrl: './modify-details.component.scss'
})
export class ModifyDetailsComponent implements OnInit, OnDestroy {
  public recordFormGroup: FormGroup = new FormGroup({});
  public shareData$: Subscription = new Subscription();
  public allRecords: Detail[] = [];
  public showValidationForSequence: boolean = false;
  @Input() selectedRecordDetails?: Detail;

  constructor(private syncfusionDataService: SyncfusionDataService) {
  }

  ngOnInit() {
    this.buildForm();
    this.shareData$ = this.syncfusionDataService.shareData$.subscribe((data: Detail[]) => {
      if (data) {
        this.allRecords = data;
      }
    });
    if (this.selectedRecordDetails) {
      this.recordFormGroup?.patchValue(this.selectedRecordDetails);
    }
    this.syncfusionDataService.fetchData();
  }

  ngOnDestroy() {
  }

  onSubmitDetails() {
    if (this.recordFormGroup) {
      if (this.recordFormGroup?.valid) {
        this.syncfusionDataService.addOrUpdateDetails(this.recordFormGroup?.value);
      } else {
        this.recordFormGroup?.markAllAsTouched();
      }
    }
  }

  buildForm() {
    this.recordFormGroup = new FormGroup({
      'y_seq': new FormControl(null, Validators.required),
      'mdrm': new FormControl(null),
      'schedule': new FormControl(null),
      'abs_change_pct': new FormControl(null),
      'line_item_code': new FormControl(null),
      'item_name': new FormControl(null),
      'q2_2023': new FormControl(null),
      'q3_2023': new FormControl(null)
    });
  }

  closeAddOrUpdatePage() {
    this.syncfusionDataService.closeAddOrUpdatePage(true)
  }

  onEnteringSequenceNo(event: any) {
    if (event?.value) {
      const foundSeqIndex = this.allRecords?.findIndex((data: Detail) => data?.y_seq === event?.value)
      if (foundSeqIndex !== -1) {
        if (this.selectedRecordDetails) {
          if (this.selectedRecordDetails?.y_seq === event?.value) {
            this.showValidationForSequence = false;
          } else {
            this.showValidationForSequence = true;
          }
        } else {
          this.showValidationForSequence = true;
        }
      } else {
        this.showValidationForSequence = false;
      }
    }
  }
}
