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
  constructor(private resolver: ComponentFactoryResolver, private dialog: MdDialog) {
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
      this.verifierFichier(widget, event.fichier);
    }
  }

  /**
   * Verifier la taille du fichier choisi
   * @param widget
   */
  private verifierFichier(widget: ComponentRef<UploadComponent>, fichier: File): void {

    /**
     * Vérifier que les fichiers sont plus petits que 2 Meg =  2*1024*1024
     */

      //let thisFile: File = files[i];
    let fileName: string = fichier.name;
    let fileLength: number = fichier.size;
    let fileExt: string = fichier.type;

    console.info("=====> name %s, length = %d,  extension = %s", fileName, fileLength, fileExt);

    let maxSize = 2 * 1024 * 1024;
    maxSize = 1111;
    if (fileLength <= maxSize) {

      // fichier est validé
      widget.instance.fichierValide(fichier);
    } else {
      this.afficherErreur(`La taille de ${fileName} choisi est plus grand que 2 mégabytes`);
    }

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
    console.log('uploader fichier......');
  }


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

