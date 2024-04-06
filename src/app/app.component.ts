import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SyncfusionDataComponent} from "./syncfusion-data/syncfusion-data.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SyncfusionDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Syncfusion-grid-assessment';
}
