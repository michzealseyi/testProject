import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
@Component({
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [MatDialogModule, MatProgressSpinnerModule, MatIconModule,NzSpinModule],
  selector: 'app-loader-modal',
  templateUrl: './loader-modal.component.html',
  styleUrls: ['./loader-modal.component.scss'],

})
export class LoaderModalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
