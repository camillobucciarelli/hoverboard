import { Success } from '@abraham/remotedata';
import { customElement, property } from '@polymer/decorators';
import '@polymer/paper-icon-button';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/hero/simple-hero';
import '../components/markdown/short-markdown';
import '../elements/shared-styles';
import '../elements/games-leaderboard';
import '../elements/games-settings';
import { RootState } from '../store';
import { ReduxMixin } from '../store/mixin';
import { heroSettings } from '../utils/data';
import { updateMetadata } from '../utils/metadata';

@customElement('games-page')
export class GamesPage extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
        }
      </style>

      <simple-hero page="games">
        <div class="dialog-container header-content" layout horizontal center>
          
        </div>
      </simple-hero>

      <div class="container content">
        <template is="dom-if" if="[[signedIn]]">
          <games-settings></games-settings>
        </template>
        
        <games-leaderboard></games-leaderboard>
      </div>

      <footer-block></footer-block>
    `;
  }

  private heroSettings = heroSettings.games;

  @property({ type: Boolean })
  private signedIn = false;

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(this.heroSettings.title, this.heroSettings.metaDescription);
  }

  override stateChanged(state: RootState) {
    this.signedIn = state.user instanceof Success;
  }
}
