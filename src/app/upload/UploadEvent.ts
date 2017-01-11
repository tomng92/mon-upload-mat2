/**
 * Événement émis par le uploader widget.
 */
export class UploadEvent {
  constructor(public uploaderId: string, public action: string){};
}
