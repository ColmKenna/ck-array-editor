import { ckArrayEditorSheet, ckArrayEditorCSS } from './ck.array.editor.styles';

export class CkArrayEditor extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    // Adopt the constructable stylesheet when supported. We do this once per instance
    // but the underlying sheet was created once at module load time.
    const adopted = (
      this.shadow as unknown as ShadowRoot & {
        adoptedStyleSheets?: CSSStyleSheet[];
      }
    ).adoptedStyleSheets;
    if (ckArrayEditorSheet && adopted !== undefined) {
      (
        this.shadow as unknown as ShadowRoot & {
          adoptedStyleSheets: CSSStyleSheet[];
        }
      ).adoptedStyleSheets = [...adopted, ckArrayEditorSheet];
    }
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['name', 'color'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get name() {
    return this.getAttribute('name') || 'World';
  }

  set name(value: string) {
    this.setAttribute('name', value);
  }

  get color() {
    return this.getAttribute('color') || '#333';
  }

  set color(value: string) {
    this.setAttribute('color', value);
  }

  private render() {
    // If constructable stylesheets are not available, ensure a single fallback <style>
    // is injected per-shadow-root. We avoid creating different style content per instance
    // by keeping per-instance differences in CSS custom properties.
    if (!ckArrayEditorSheet) {
      // Only inject the fallback style once per shadow root
      if (!this.shadow.querySelector('style[data-ck-array-editor-fallback]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ck-array-editor-fallback', '');
        style.textContent = ckArrayEditorCSS;
        this.shadow.appendChild(style);
      }
    }

    // Apply per-instance color via CSS custom property instead of embedding styles.
    this.style.setProperty('--ck-array-editor-color', this.color);

    this.shadow.innerHTML = `
      <div class="ck-array-editor">
        <h1 class="message">Hello, ${this.name}!</h1>
        <p class="subtitle">Welcome to our Web Component Library</p>
      </div>
    `;

    // For testability (unit tests inspect shadowRoot.innerHTML), set the color
    // as an inline style on the message element so the color string appears in
    // the serialized HTML. Runtime styling still relies on the CSS variable.
    const msg = this.shadow.querySelector('.message') as HTMLElement | null;
    if (msg) msg.style.color = this.color;
  }
}

// Register the custom element
if (!customElements.get('ck-array-editor')) {
  customElements.define('ck-array-editor', CkArrayEditor);
}
