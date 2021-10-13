import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl',
})
export class SanitizeUrlPipePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(v: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl(v);
  }
}
