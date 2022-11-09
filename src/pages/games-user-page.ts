import { Failure, Success } from '@abraham/remotedata';
import { computed, customElement, observe, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import { RouterLocation } from '@vaadin/router';
import '../components/hero/simple-hero';
import '../elements/games-user-history';
import '../components/markdown/remote-markdown';
import '../elements/footer-block';
import { router } from '../router';
import { RootState, store } from '../store';
import { fetchGameHistory } from '../store/game-history/actions';
import { GameHistoryState } from '../store/game-history/state';
import { ReduxMixin } from '../store/mixin';
import { locationDetail, heroSettings } from '../utils/data';
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
      <games-user-history></games-user-history>
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

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(this.heroSettings.title, this.heroSettings.metaDescription);
  }

  onAfterEnter(location: RouterLocation) {
    this.userId = location.params?.['id']?.toString();
    if (this.userId) store.dispatch(fetchGameHistory(this.userId));
  }

  @computed('userId')
  get user() {
    return this.userId;
  }

  @observe('gameHistory')
  gameHistoryChanged(gameHistory: GameHistoryState) {
    if (gameHistory instanceof Failure) {
      if ('permission-denied' === (gameHistory.error as any)?.code) {
        // router.render('/games');
      }
    }
  }

  override stateChanged(state: RootState) {
    this.gameHistory = state.gamesHistory;
  }
}
