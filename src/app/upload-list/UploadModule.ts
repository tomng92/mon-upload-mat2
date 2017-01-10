
import {NgModule} from "@angular/core";
import {UploadComponent} from "./upload/UploadComponent";
import {UploadListComponent} from "./UploadListComponent";
import {MaterialModule} from "@angular/material";
@NgModule({
    declarations: [UploadComponent, UploadListComponent],
    imports: [MaterialModule.forRoot()],
    bootstrap: [UploadListComponent]
  }
)

export class UploadModule {

}
