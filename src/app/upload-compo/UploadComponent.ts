/**
 * Created by Fabian on 19/10/2016.
 * https://gist.githubusercontent.com/Toxicable/1c736ed16c95bcdc7612e2c406b5ce0f/raw/d0264368999014e46505da91cbfc6a87053d70e0/file-upload.component.ts
 */
import {
  Component, ElementRef, Input, ViewChild, transition, animate, state, style, trigger,
  EventEmitter, Output, ComponentRef
} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {UploadListComponent} from "../upload-list/UploadListComponent";



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

  @Output() notifier: EventEmitter<string> = new EventEmitter<string>();
  // @Input() monContainer : ComponentRef<UploadListComponent>;

  fileUploadEtat: string = "etat-debut" ; // variable état du composant "etat-debut" <-> "etat-fin"

  @Input() monId: string;// 'mon-upload-1'

  resultatUpload: String;

  constructor(private http: Http) { }

  @Input() multiple: boolean = true;
  url = "http://localhost:8080/SpringFileUpload/uploadFile";

  /**
   * Change handler
   */
  monUploadChange(event) {
    console.log("mon upload onchange invoked!...." + event);
  }

  /**
   * Upload...
   */
  uploadFichier() {
    console.log("=========>>>>> " + this.monUploadRef);

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

      this.notifier.emit("fichier choisi!");
      this.divBoutonRef.nativeElement.style.display = 'block';
      //this.monContainer.notificationDuWidget();

      let maxSize = 2*1024*1024;
      if (fileLength > maxSize) {
        this.resultatUpload = `La taille de ${fileName} est plus grand que 2 mégabytes`;
        return;
      }
    }


    // See https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
    let formData:FormData = new FormData();
    formData.append('monUpload', files[0], files[0].name);
    let headers = new Headers();
   // headers2.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });


    this.http
      .post( this.url + '?name=' + files[0].name, formData, options)
      .subscribe(
        x => this.resultatUpload = x.toString(),  //console.log('------> onNext: %s', x),
        e => console.log('------> onError: %s', e.toString()),
        () => console.log("Succès!")
      );

      this.resultatUpload = `le fichier ${files[0].name} a été téléversé avec succès!`;
  }


  /**
   * Enlever file upload
   */
  enleverUpload() {
    this.notifier.emit("");
  }
}
