declare module "sanitize-html" {
  export interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedSchemes?: string[];
  }

  export interface SanitizeHtml {
    (dirty: string, options?: IOptions): string;
    defaults: {
      allowedTags: string[];
    };
  }

  const sanitizeHtml: SanitizeHtml;

  export default sanitizeHtml;
}
