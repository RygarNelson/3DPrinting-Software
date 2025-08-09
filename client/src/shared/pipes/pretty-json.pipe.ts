import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson',
  standalone: true
})
export class PrettyJsonPipe implements PipeTransform {
  
  transform(value: any, args?: any): string {
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
          return value;
        }
      }
      
      // Convert to JSON with proper indentation
      const jsonString = JSON.stringify(value, null, 2);
      
      // Add syntax highlighting with HTML
      return this.syntaxHighlight(jsonString);
    } catch (error) {
      // If anything fails, return the original value as string
      return String(value);
    }
  }
  
  private syntaxHighlight(json: string): string {
    // Replace different JSON elements with colored spans
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
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
    });
  }
}
