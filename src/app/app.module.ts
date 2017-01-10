import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {MaterialModule, MdIconRegistry} from "@angular/material";
import {UploadListComponent} from "./upload-list/UploadListComponent";
import {UploadComponent} from "./upload-list/upload/UploadComponent";
import 'hammerjs'
import {UploadModule} from "./upload-list/UploadModule";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    UploadModule,
    MaterialModule.forRoot()
  ],

  entryComponents: [UploadComponent], // reference a la composante a creer

  providers: [MdIconRegistry],
  bootstrap: [AppComponent]
})
export class AppModule { }
