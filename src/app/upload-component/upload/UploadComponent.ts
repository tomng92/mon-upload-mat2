import {
  Component, ElementRef, Input, ViewChild, transition, animate, state, style, trigger,
  EventEmitter, Output, ComponentRef
} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {UploadEvent} from "../UploadEvent";
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";

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
  public fichierChoisi: File;// fichier choisi par usager.  Est vide si erreur (par ex. fichier trop grand)

  /**
   * Ctor.
   * @param http service http pour uploader
   * @param dialog Dialogue pour afficher erreurs (fichier trop grand ou deja existant)
   */
  constructor(private http: Http) {
  }

  /**
   * Upload...
   */
  private selectionFichier() {

    let files: FileList = this.monUploadRef.nativeElement.files;
    let nbFiles: number = files.length;
    if (nbFiles === 0) return;
    if (nbFiles > 1) return; // nous voulons seulement considerer l fichier

    // demander au container de verifier le fichier choisi
    this.notifier.emit(new UploadEvent(this.monId, UploadEvent.VERIFIER_FICHIER, files[0]));

    /**


     **
     * Vérifier que les fichiers sont plus petits que 2 Meg =  2*1024*1024
     *
     for (let i = 0; i < files.length; i++) {

      let fichier: File = files.item(i);

      //let thisFile: File = files[i];
      let fileName: string = fichier.name;
      let fileLength: number = fichier.size;
      let fileExt: string = fichier.type;

      console.info("=====> name %s, length = %d,  extension = %s", fileName, fileLength, fileExt);

      let maxSize = 2 * 1024 * 1024;
      maxSize = 1111;
      if (fileLength > maxSize) {

        this.afficherErreur(`La taille de ${fileName} est plus grand que 2 mégabytes`);

      } else if (this.uploadUrl && this.uploadUrl.length > 0) {

        // Chnager le label
        this.monUploadLabelRef.nativeElement.innerHTML = fileName;
        this.monUploadIconRef.nativeElement.style.display = 'none'; // cacher img

        // montrer le bouton Supprimer
        this.divBoutonRef.nativeElement.style.display = 'block';


        // le fichierChoisi est ok.
        this.fichierChoisi = fichier;

        // Uploader le fichier si le url est defini
        //this.executeHttpUpload(fichier);
      }
    }

     */

  }

  /**
   * Fonction invoqué par notre container si le fichier est valide (< 2M).
   * @param fichier
   */
  public fichierValide(fichier: File) {

    // Changer le label
    this.monUploadLabelRef.nativeElement.innerHTML = fichier.name;
    this.monUploadIconRef.nativeElement.style.display = 'none'; // cacher img

    // montrer le bouton Supprimer
    this.divBoutonRef.nativeElement.style.display = 'block';

    // set le fichierChoisi
    this.fichierChoisi = fichier;
  }


  /**
   * Invoker le http pour faire le upload
   */
  executeHttpUpload(file: File) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
    let formData: FormData = new FormData();
    formData.append('monUpload', file, file.name);
    let headers = new Headers();

    headers.append('Accept', 'application/json');
    let options = new RequestOptions({headers: headers});


    this.http
      .post(this.uploadUrl + '?name=' + file.name, formData, options)
      .subscribe(
        x => console.log(x.toString()),
        e => console.log('------> Erreur du upload: %s', e.toString()),
        () => console.log("Succès!")
      );
  }

  /**
   * Enlever file upload
   */
  private supprimerUploadWidget() {
    this.notifier.emit(new UploadEvent(this.monId, UploadEvent.SUPPRIMER_WIDGET, null));
  }
}
