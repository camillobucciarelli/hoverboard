import { Success } from '@abraham/remotedata';
import { customElement, observe, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import { RouterLocation } from '@vaadin/router';
import '../components/hero/simple-hero';
import '../components/markdown/remote-markdown';
import '../elements/footer-block';
import '../elements/games-user-history';
import { RootState } from '../store';
import { GameHistoryState } from '../store/game-history/state';
import { ReduxMixin } from '../store/mixin';
import { heroSettings, locationDetail } from '../utils/data';
import { updateMetadata } from '../utils/metadata';

@customElement('games-user-page')
export class GamesUserPage extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <simple-hero page="history">
        <div class="dialog-container header-content" layout horizontal center></div>
      </simple-hero>
      <template is="dom-if" if="[[isOrganizer]]">
        <games-user-history userid="[[userId]]"></games-user-history>
      </template>
      <footer-block></footer-block>
    `;
  }

  private heroSettings = heroSettings.locationPage;

  @property({ type: String })
  source = locationDetail;
  @property({ type: String })
  userId: string | undefined;
  @property({ type: Array })
  gameHistory: GameHistoryState | undefined;
  @property({ type: Boolean })
  isOrganizer: boolean = false;

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(this.heroSettings.title, this.heroSettings.metaDescription);
  }

  onAfterEnter(location: RouterLocation) {
    this.userId = location.params?.['id']?.toString();
  }

  @observe('userId')
  userIdChanged(userId: string) {
    console.log('userIdChanged', userId);
  }

  override stateChanged(state: RootState) {
    if (state.user instanceof Success) {
      this.isOrganizer = state.user.data.claims.role === 'ORGANIZER';
    }
  }
}
