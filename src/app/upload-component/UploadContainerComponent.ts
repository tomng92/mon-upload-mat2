/**
 * http://blog.rangle.io/dynamically-creating-components-with-angular-2/
 * https://egghead.io/lessons/angular-2-generate-angular-2-components-programmatically-with-entrycomponents
 */
import {
  Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef,
  Input
} from "@angular/core";
import {UploadComponent} from "./upload/UploadComponent";
import {UploadEvent} from "./UploadEvent";
import {MdDialogRef, MdDialog} from "@angular/material";
import {Headers, RequestOptions, Http} from "@angular/http";
import {Observable} from "rxjs";

@Component({
  selector: 'mon-upload-list',
  templateUrl: './UploadContainerComponent.html'
})

export class UploadContainerComponent {

  listeUpload: Array<ComponentRef<UploadComponent>> = [];

  curId: number = 1; // pour composer le id du UploadComponent, exemple "monUpload-2"

  @ViewChild('uploadContainer', {read: ViewContainerRef}) container: ViewContainerRef;
  @Input() uploadUrl: string;

  /**
   * Constructor.
   */
  constructor(private http: Http, private resolver: ComponentFactoryResolver, private dialog: MdDialog) {
  }


  /**
   * Creation d'un uploader widget.
   */
  private creerUploadWidget() {

    // créer et initialiser notre uploader
    const widgetFactory = this.resolver.resolveComponentFactory(UploadComponent);
    let uploadWidget: ComponentRef<UploadComponent> = this.container.createComponent(widgetFactory);
    let uploadId = "mon-upload-" + this.curId++; // composer id du widget
    uploadWidget.instance.monId = uploadId; // passer les infos au widget
    uploadWidget.instance.uploadUrl = this.uploadUrl;

    console.log(`création du uploader avec id '${uploadId}'`);

    this.listeUpload.push(uploadWidget);

    // écouter les événements de notre uploader (présentement un seul: pour suppression)
    uploadWidget.instance.notifier.subscribe(event => this.notificationDuUploader(event));
  }

  /**
   * Notification du notre uploader widget.
   */
  private notificationDuUploader(event: UploadEvent) {

    // le seul evenement est pour la suppression du uploader
    console.log(`Evenement du upload widget '${event.widgetId}' '${event.action}'`);

    let widget: ComponentRef<UploadComponent>;
    // rechercher le upload widget
    for (let compo of this.listeUpload) {
      if (compo.instance.monId == event.widgetId) {
        widget = compo;
        break;
      }
    }

    // faire action demandé
    if (event.action == UploadEvent.SUPPRIMER_WIDGET) {
      widget.destroy();
    } else {
      if (!this.verifierTailleFichier(widget, event.fichier)) {
        this.afficherErreur(`Le fichier '${event.fichier.name}' est plus grand que 2 mégabytes`);
      } else if (!this.verifierFichierDejaSelectionne(widget, event.fichier)) {
        this.afficherErreur(`Le fichier '${event.fichier.name}' est déjà sélectionné`);
      } else
        widget.instance.fichierValide(event.fichier); // ficher valide
    }
  }

  /**
   * Verifier la taille du fichier choisi
   * @param widget
   */
  private verifierTailleFichier(widget: ComponentRef<UploadComponent>, fichier: File): boolean {

    /**
     * Vérifier que les fichiers sont plus petits que 2 Meg =  2*1024*1024
     */

      //let thisFile: File = files[i];
    let fileName: string = fichier.name;
    let fileLength: number = fichier.size;
    let fileExt: string = fichier.type;

    console.info("=====> name %s, length = %d,  extension = %s", fileName, fileLength, fileExt);

    let maxSize = 2 * 1024 * 1024;
    // maxSize = 1111;

    return (fileLength <= maxSize);
  }

  /**
   * Vérifier si le fichier est déja selectionné.
   * @param widget
   * @param fichier
   */
  private verifierFichierDejaSelectionne(widget: ComponentRef<UploadComponent>, fichier: File): boolean {

    // rechercher le upload widget
    for (let compo of this.listeUpload) {
      // verifier si le meme fichier est dans un autre upload
      if (compo.instance.monId != widget.instance.monId) {
        // verifier nom et taille fichier.
        // Note: le <input type=file> ne nous donne pas le path!
        if (compo.instance.fichierChoisi
          && compo.instance.fichierChoisi.name == fichier.name
          && compo.instance.fichierChoisi.size == fichier.size) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Sleep comme au java (https://eureka.ykyuen.info/2011/02/20/javascript-sleep-function/)
   * @param delay en millisecondes
   */
  mySleep(delay) {
    console.log('start sleep');
    let start = new Date().getTime();
    while (new Date().getTime() < start + delay);
    console.log('end sleep');
  }

  /**
   * Invoker le http pour upload du fichier
   */
  executeHttpUpload(uploadWidget: ComponentRef<UploadComponent>) {

    let fichier: File = uploadWidget.instance.fichierChoisi;
    uploadWidget.instance.signalerStartUpload();
    this.uploadUrl = "http://localhost:8080/SpringFileUpload/uploadFile";


    // See https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
    let formData: FormData = new FormData();
    formData.append('monUpload', fichier, fichier.name);
    let headers = new Headers();

    headers.append('Accept', 'application/json');
    let options = new RequestOptions({headers: headers});


    this.http
      .post(this.uploadUrl + '?name=' + fichier.name, formData, options)
      .subscribe(
        x => console.log("http-> " + x),
        err => this.afficherErreur(`Televersement echoué de ${this.listeUpload.length} fichiers.` ),
        () => this.afficherErreur(`Televersement avec succès de ${this.listeUpload.length} fichiers.` ),
      );

    //this.mySleep(4000);

    //uploadWidget.instance.signalerEndUpload(true);
  }

  /**
   * =============================
   * Invoker le http pour upload du fichier des fichiers multiples.....
   * =============================
   * As of 13:58pm du 17 janvier 2017, le
   */
  executeHttpUploadMultiple() {


    let formData: FormData = new FormData();
    this.uploadUrl = "http://localhost:8080/SpringFileUpload/uploadMultipleFile";


    // ajouter les fichiers au formData
    for (let compo of this.listeUpload) {
      let fichier: File = compo.instance.fichierChoisi;

      console.log(`uploading demandé pour ${compo.instance.fichierChoisi.name}`);
      formData.append('fichierUpload', fichier, fichier.name);
    }


   let headers = new Headers();

    headers.append('Accept', 'application/json');
    let options = new RequestOptions({headers: headers});


    this.http
      .post(this.uploadUrl + '?name=' + (this.listeUpload.length + " fichiers"), formData, options)
      .subscribe(
        x => console.log("http-> " + x),
        err => this.afficherErreur(`Televersement echoué de ${this.listeUpload.length} fichiers.` ),
        () => this.afficherErreur(`Televersement avec succès de ${this.listeUpload.length} fichiers.` )      );

    //this.mySleep(4000);

    //uploadWidget.instance.signalerEndUpload(true);
  }


  /**
   * click handler pour ajout un autre upload
   */
  private ajoutUploader() {
    this.creerUploadWidget()
  }

  /**
   * Uploader les fichiers choisis
   */
  private uploadFichiers() {

    let uploadMultiple  = true;

    if (uploadMultiple) {
      this.executeHttpUploadMultiple();
    } else {

      for (let compo of this.listeUpload) {

        console.log(`uploading demandé pour ${compo.instance.fichierChoisi.name}`);
        this.executeHttpUpload(compo);
      }
    }
  }

  // private uploadFichiers() {
  //     this.uploadCetItem(0);
  // }
  //

  /**
   * Dialogue pour afficher erreur
   * @param msgErreur
   */
  private afficherErreur(msgErreur: string) {

    let dialogRef: MdDialogRef<DialogContent> = this.dialog.open(DialogContent);
    dialogRef.componentInstance.messageErreur = msgErreur; // afficher erreur
  }
}


/**
 * Voir https://material.angular.io/components/component/dialog
 */
@Component({
  //selector: 'dialog-upload',
  template: `
    <md-card>
        <p>{{messageErreur}}</p>
      <button md-raised-button (click)="dialogRef.close()">Fermer</button>
    </md-card>
`,
})
export class DialogContent {
  @Input() messageErreur;

  constructor(public dialogRef: MdDialogRef<DialogContent>) {
  }
}

