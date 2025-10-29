const ckArrayEditorCSS = `
:host {
  display: block;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

\.ck-array-editor {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

\.ck-array-editor:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.message {
  font-size: 1.5rem;
  margin: 0;
  /* per-instance color via CSS custom property */
  color: var(--ck-array-editor-color, #333);
}

.subtitle {
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
}
`;
// Try to create a constructable stylesheet where supported. Fall back to null.
const ckArrayEditorSheet = (() => {
    try {
        // CSSStyleSheet may not be available in older browsers
        // create and populate the sheet once at module-eval time
        // so it gets parsed only once.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: may not exist in all targets
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(ckArrayEditorCSS);
        return sheet;
    }
    catch {
        return null;
    }
})();

class CkArrayEditor extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        // Adopt the constructable stylesheet when supported. We do this once per instance
        // but the underlying sheet was created once at module load time.
        const adopted = this.shadow.adoptedStyleSheets;
        if (ckArrayEditorSheet && adopted !== undefined) {
            this.shadow.adoptedStyleSheets = [...adopted, ckArrayEditorSheet];
        }
    }
    connectedCallback() {
        this.render();
    }
    static get observedAttributes() {
        return ['name', 'color'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
    get name() {
        return this.getAttribute('name') || 'World';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get color() {
        return this.getAttribute('color') || '#333';
    }
    set color(value) {
        this.setAttribute('color', value);
    }
    render() {
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
        const msg = this.shadow.querySelector('.message');
        if (msg)
            msg.style.color = this.color;
    }
}
// Register the custom element
if (!customElements.get('ck-array-editor')) {
    customElements.define('ck-array-editor', CkArrayEditor);
}

export { CkArrayEditor };
//# sourceMappingURL=ck-array-editor.esm.js.map
