import {Component, Optional} from '@angular/core';
import {MdDialog, MdDialogRef, MdSnackBar, MdIconRegistry} from '@angular/material';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isDarkTheme: boolean = false;
  lastDialogResult: string;

  foods: any[] = [
    {name: 'Pizza', rating: 'Excellent'},
    {name: 'Burritos', rating: 'Great'},
    {name: 'French fries', rating: 'Pretty good'},
  ];

  progress: number = 0;

  constructor(private registry: MdIconRegistry, private sanitizer: DomSanitizer, private _dialog: MdDialog, private _snackbar: MdSnackBar) {

    // Enregister le upload-icon...
    //let safeUrl: SafeUrl = sanitizer.bypassSecurityTrustResourceUrl("/assets/mon-upload-icon.svg");
    let safeUrl: SafeUrl = sanitizer.bypassSecurityTrustResourceUrl("https://github.com/FezVrasta/material-design-icons-svg/blob/master/file/svg/design/ic_file_upload_24px.svg");

    console.log('sanitizer invoked %s',safeUrl.toString());
    registry.addSvgIcon("monUploadIcon", safeUrl);

    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.progress = (this.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 200);
  }

  openDialog() {
    let dialogRef = this._dialog.open(DialogContent);

    dialogRef.afterClosed().subscribe(result => {
      this.lastDialogResult = result;
    })
  }

  showSnackbar() {
    this._snackbar.open('YUM SNACKS', 'CHEW');
  }
}


@Component({
  template: `
    <p>This is a dialog</p>
    <p>
      <label>
        This is a text box inside of a dialog.
        <input #dialogInput>
      </label>
    </p>
    <p> <button md-button (click)="dialogRef.close(dialogInput.value)">CLOSE</button> </p>
  `,
})
export class DialogContent {
  constructor(@Optional() public dialogRef: MdDialogRef<DialogContent>) { }
}
