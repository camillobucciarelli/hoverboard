import { Success } from '@abraham/remotedata';
import { computed, customElement, observe, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import { RouterLocation } from '@vaadin/router';
import '../components/hero/simple-hero';
import '../components/markdown/remote-markdown';
import '../elements/footer-block';
import { router } from '../router';
import { selectGameHistory } from '../store/game-history/selectors';
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
      <div>Mi ammazzo [[speaker]]</div>
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
  }

  @computed('userId')
  get user() {
    return this.userId;
  }

  @observe('userId')
  onSpeakersAndSpeakerId(gameHistory: GameHistoryState, userId: string) {
    if (userId && gameHistory instanceof Success) {
      this.gameHistory = selectGameHistory(userId);
      if (!this.speaker) {
        router.render('/404');
      } else {
        updateImageMetadata(this.speaker.name, this.speaker.bio, {
          image: this.speaker.photoUrl,
          imageAlt: this.speaker.name,
        });
      }
    }
  }
}
