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

@Component({
  selector: 'mon-upload-list',
  templateUrl: './UploadContainerComponent.html'
})

export class UploadContainerComponent {

  listeUpload: Array<ComponentRef<UploadComponent>> = [];

  curId: number = 1; // pour composer le id du UploadComponent, exemple "monUpload-2"

  @ViewChild('uploadContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @Input() uploadUrl: string;

  /**
   * Constructor.
   */
  constructor(private resolver: ComponentFactoryResolver) {}


  /**
   * Creation d'un uploader widget.
   */
  creerUploadWidget() {

    // créer et initialiser notre uploader
    const widgetFactory = this.resolver.resolveComponentFactory(UploadComponent);
    let uploadWidget: ComponentRef<UploadComponent> = this.container.createComponent(widgetFactory);
    let uploadId = "mon-upload-" + this.curId++ ; // composer id du widget
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
  notificationDuUploader(event: UploadEvent) {

    // le seul evenement est pour la suppression du uploader
    console.log(`Evenement de suppression du uploader '${event.uploaderId}'`);

    for (let compo of this.listeUpload) {
      if (compo.instance.monId == event.uploaderId) {
       compo.destroy();
       break;
      }
    }
  }

  /**
   * click handler pour ajout un autre upload
   */
  ajoutUploader() {
    this.creerUploadWidget()
  }

}
