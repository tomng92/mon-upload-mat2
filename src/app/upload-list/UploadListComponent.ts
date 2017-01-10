/**
 * http://blog.rangle.io/dynamically-creating-components-with-angular-2/
 * https://egghead.io/lessons/angular-2-generate-angular-2-components-programmatically-with-entrycomponents
 */
import {Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef} from "@angular/core";
import {UploadComponent} from "./upload/UploadComponent";

@Component({
  selector: 'mon-upload-list',
  template: `<md-list #uploadContainer></md-list>
            <button md-raised-button (click)="ajoutUploadHandler()">Ajout</button>`,

})
export class UploadListComponent {

  listeUpload: Array<ComponentRef<UploadComponent>> = [];

  curId: number = 1; // pour composer le id du UploadComponent, exemple "monUpload-2"

  @ViewChild('uploadContainer', { read: ViewContainerRef }) container: ViewContainerRef;

  /**
   * Ctor;
   * @param resolver
   */
  constructor(private resolver: ComponentFactoryResolver) {
  }

  /**
   * On ajoute un premier composante au debut.
   */
  ngAfterContentInit() {
    this.creerUploadWidget();
  }

  /**
   * Creation d'un upload widget.
   */
  creerUploadWidget() {

    const widgetFactory = this.resolver.resolveComponentFactory(UploadComponent);
    let uploadWidget: ComponentRef<UploadComponent> = this.container.createComponent(widgetFactory);
    let uploadId = "mon-upload-" + this.curId++ ;
    uploadWidget.instance.monId = uploadId;
    console.log("===== creation du upload id " + uploadId);

    this.listeUpload.push(uploadWidget);

    // ecouter notre enfant
    uploadWidget.instance.notifier.subscribe(event => this.notificationDuWidget(event));
  }

  /**
   * Notification du notre enfant composant pour le supprimer
   * (pour le moment le seul event du uploadWidget est de le supprimer)
   */
  notificationDuWidget(event) {
    console.log(`Notification de suppression de notre enfant ${event}`);
    let idASupprimer : String = event;

    for (let compo of this.listeUpload) {
      if (compo.instance.monId == idASupprimer) {
       compo.destroy();
       break;
      }
    }
  }

  /**
   * click handler pour ajout un autre upload
   */
  ajoutUploadHandler() {
    this.creerUploadWidget()
  }

}
