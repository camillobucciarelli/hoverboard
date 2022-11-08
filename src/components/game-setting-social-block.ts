import '@power-elements/lazy-image';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ThemedElement } from './themed-element';
import { games } from '../utils/data';

@customElement('game-setting-social-block')
export class GameSettingSocialBlock extends ThemedElement {
  @property({ type: String, attribute: 'icon-color' })
  iconColor = '#000';
  @property({ type: String, attribute: 'icon' })
  icon = 'hoverboard:';
  @property({ type: String, attribute: 'social-handle' })
  socialHandle = '';

  @property({ type: Boolean })
  private isEditing = false;

  @property({ type: String})
  private inputValue = '';

  static override get styles() {
    return [
      ...super.styles,
      css`
        :host {
          padding: 20px;
        }

        iron-icon {
          margin: 0 10px;
        }
      `,
    ];
  }

  override render() {
    return html`
      <div
        layout
        horizontal
        center-justified
      >
        <iron-icon 
          icon="${this.icon}"
          style="color: ${this.iconColor}"></iron-icon>
        <div id="value" ?hidden="${this.isEditing}">${this.handle}</div>
        <iron-icon 
          icon="hoverboard:edit"
          @click="${this.toggleEditing}"
          ?hidden="${this.isEditing}"
        ></iron-icon>
        <input 
          type="text" 
          id="valueInput" 
          value="${this.handleValue}" 
          ?hidden="${!this.isEditing}"
          @change="${this.setValue}"
        ></input>
        <iron-icon 
          icon="hoverboard:save"
          ?hidden="${!this.isEditing}"
          @click="${this.save}"
        ></iron-icon>
      </div>
    `;
  }

  private get handle() {
    return html`
      <span>${this.socialHandle && this.socialHandle !== '' ? '@' + this.socialHandle : games.socialNotSet}</span>
    `;
  }

  private get handleValue() {
    return this.socialHandle && this.socialHandle !== '' ? this.socialHandle : '';
  }

  private toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  private setValue(event: any) {
    this.inputValue = event.target.value;
  }

  private save() {
    this.dispatchEvent(new CustomEvent('valuesaved', {
        bubbles: true, 
        composed: true, 
        detail: {
          value: this.inputValue
        }
      }));
    this.toggleEditing();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'game-setting-social-block': GameSettingSocialBlock;
  }
}
