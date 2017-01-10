/**
 * http://blog.rangle.io/dynamically-creating-components-with-angular-2/
 * https://egghead.io/lessons/angular-2-generate-angular-2-components-programmatically-with-entrycomponents
 */
import {Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef} from "@angular/core";
import {UploadComponent} from "../upload-compo/UploadComponent";

@Component({
  selector: 'mon-upload-list',
  template: `<md-list #uploadContainer></md-list>`,

})
export class UploadListComponent {

  listeUpload: Array<ComponentRef<UploadComponent>> = [];

  listMap: Map<String, ComponentRef<UploadComponent>> = new Map();

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
    this.addUploadWidget();
  }

  /**
   * Append le premier upload
   */
  addUploadWidget() {

    console.log('creation de upload widget....');

    const widgetFactory = this.resolver.resolveComponentFactory(UploadComponent);
    let uploadWidget: ComponentRef<UploadComponent> = this.container.createComponent(widgetFactory);
    let uploadId = "mon-upload-" + this.curId++ ;
    uploadWidget.instance.monId = uploadId;
    console.log("===== creation du upload id " + uploadId);

    this.listeUpload.push(uploadWidget);

    this.listMap.set(uploadId)

    // ecouter notre enfant
    uploadWidget.instance.notifier.subscribe(event => this.notificationDuWidget(event));
  }

  /**
   * Notification du notre enfant.
   */
  notificationDuWidget(event) {
    console.log(`Notification de notre enfant ${event} - ${event.src}`);
    this.addUploadWidget();
  }


}
