
import {NgModule} from "@angular/core";
import {UploadComponent} from "./upload/UploadComponent";
import {UploadContainerComponent} from "./UploadContainerComponent";
import {MaterialModule} from "@angular/material";
@NgModule({
    declarations: [UploadComponent, UploadContainerComponent],
    imports: [MaterialModule.forRoot()],
    exports: [UploadContainerComponent]
  }
)

export class UploadModule {

}
