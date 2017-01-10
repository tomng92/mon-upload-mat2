import {EventEmitter, Injectable} from "@angular/core";
@Injectable()
class EmitSelectionFichier {

  name: any;
  // EventEmitter should not be used this way - only for `@Output()`s
  emitter: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    //this.name = "Jack";
  }
  selectionFichier(){
    //this.name = 'Jane';
    this.emitter.next(this.name);
  }
}
