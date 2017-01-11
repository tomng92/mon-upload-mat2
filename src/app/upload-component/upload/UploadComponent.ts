
import {
  Component, ElementRef, Input, ViewChild, transition, animate, state, style, trigger,
  EventEmitter, Output, ComponentRef
} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {UploadEvent} from "../UploadEvent";

@Component({
  selector: 'mon-upload-composant',
  templateUrl: './UploadComponent.html',
  styleUrls: ['./UploadComponent.css']

})
export class UploadComponent {

  @ViewChild('monUploadInput') monUploadRef;
  @ViewChild('monUploadLabel') monUploadLabelRef;
  @ViewChild('monUploadIcon') monUploadIconRef;
  @ViewChild('divBouton') divBoutonRef;

  @Output() notifier: EventEmitter<UploadEvent> = new EventEmitter();

  @Input() monId: string;// 'mon-upload-1'
  @Input() uploadUrl: string;

  resultatUpload: String;

  constructor(private http: Http) { }

  @Input() multiple: boolean = false;

  /**
   * Upload...
   */
  uploadFichier() {

    let files: FileList = this.monUploadRef.nativeElement.files;
    let nbFiles: number = files.length;
    if (nbFiles === 0) return;

    /**
     * Vérifier que les fichiers sont plus petits que 2 Meg =  2*1024*1024
     */
    for (let i = 0; i < files.length; i++) {

      let aaa : File = files.item(i);

      //let thisFile: File = files[i];
      let fileName : string = aaa.name;
      let fileLength : number = aaa.size;
      let fileExt : string = aaa.type;

      console.info("=====> name %s, length = %d,  extension = %s", fileName, fileLength, fileExt);

      // Chnager le label
      this.monUploadLabelRef.nativeElement.innerHTML = fileName;
      this.monUploadIconRef.nativeElement.style.display = 'none'; // cacher img

      // montrer le bouton Supprimer
      this.divBoutonRef.nativeElement.style.display = 'block';

      let maxSize = 2*1024*1024;
      if (fileLength > maxSize) {
        this.resultatUpload = `La taille de ${fileName} est plus grand que 2 mégabytes`;
        return;
      }
    }

    // Uploader le fichier si le url est defini
    if (this.uploadUrl && this.uploadUrl.length > 0) {

      // See https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
      let formData: FormData = new FormData();
      formData.append('monUpload', files[0], files[0].name);
      let headers = new Headers();

      headers.append('Accept', 'application/json');
      let options = new RequestOptions({headers: headers});


      this.http
        .post(this.uploadUrl + '?name=' + files[0].name, formData, options)
        .subscribe(
          x => this.resultatUpload = x.toString(),
          e => console.log('------> onError: %s', e.toString()),
          () => console.log("Succès!")
        );

      this.resultatUpload = `le fichier ${files[0].name} a été téléversé avec succès!`;
    }
  }


  /**
   * Enlever file upload
   */
  enleverUpload() {
    this.notifier.emit(new UploadEvent(this.monId, "suppression"));
  }
}
