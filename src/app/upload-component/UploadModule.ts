
import {NgModule} from "@angular/core";
import {UploadComponent} from "./upload/UploadComponent";
import {UploadContainerComponent, DialogContent} from "./UploadContainerComponent";
import {MaterialModule} from "@angular/material";
@NgModule({
    declarations: [UploadComponent, UploadContainerComponent, DialogContent],
    imports: [MaterialModule.forRoot()],
    exports: [UploadContainerComponent],
    entryComponents: [DialogContent]
  }
)
export class UploadModule {
}
