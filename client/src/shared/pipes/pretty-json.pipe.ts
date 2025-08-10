import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'prettyJson',
  standalone: true
})
export class PrettyJsonPipe implements PipeTransform {
  
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(value: any, args?: any): SafeHtml {
    if (value === null || value === undefined) {
      return '';
    }
    
    try {
      // If it's already a string, try to parse it
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          // If parsing fails, return the original string
          return this.sanitizer.bypassSecurityTrustHtml(value);
        }
      }
      
      // Convert to JSON with proper indentation (4 spaces for better readability)
      const jsonString = JSON.stringify(value, null, 4);
      
      // Add syntax highlighting with HTML
      const highlightedHtml = this.syntaxHighlight(jsonString);
      return this.sanitizer.bypassSecurityTrustHtml(highlightedHtml);
    } catch (error) {
      // If anything fails, return the original value as string
      return this.sanitizer.bypassSecurityTrustHtml(String(value));
    }
  }
  
  private syntaxHighlight(json: string): string {
    // Escape HTML characters first
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Preserve whitespace and add syntax highlighting
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'json-number';
      
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      
      return '<span class="' + cls + '">' + match + '</span>';
    }).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'); // Preserve line breaks and spaces
  }
}
