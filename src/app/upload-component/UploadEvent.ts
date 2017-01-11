/**
 * Événement émis par le uploader widget.
 *   * widgetId: id du upload widget
 *   * action:
 *     - 'supprimer-widget' supprimer le upload widget
 *     - 'verifier-fichier': verifier taille du fichier et si fichier  est déjà choisi.
 *   * fichier: fichier choisi par usager.
 *
 */
export class UploadEvent {

  public static readonly SUPPRIMER_WIDGET = 1;
  public static readonly VERIFIER_FICHIER = 2;

  constructor(public widgetId: string, public action: number, public fichier?: File){};
}
