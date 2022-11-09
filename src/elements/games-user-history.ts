import { Failure } from '@abraham/remotedata';
import { customElement, observe, property } from '@polymer/decorators';
import '@polymer/iron-icon/';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';

import '../components/markdown/short-markdown';
import '../components/text-truncate';
import { router } from '../router';
import { RootState, store } from '../store';
import { fetchGameHistory, unsubscribe } from '../store/game-history/actions';
import { GameHistoryState } from '../store/game-history/state';
import { ReduxMixin } from '../store/mixin';
import './shared-styles';

@customElement('games-user-history')
export class GamesUserHistory extends ReduxMixin(PolymerElement) {
  @property({ type: String })
  userid: string | undefined;

  @property({ type: String })
  gameHistory: GameHistoryState | undefined;

  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        .user-history {
          padding: 0 80px;
          width: 100%;
          border-collapse: collapse;
          border: none;
        }

        .user-history tr th {
          background-color: var(--default-primary-color);
          color: var(--text-primary-color);
          padding: 5px;
        }

        .user-history tr td {
          padding: 5px;
          text-align: center;
        }

        .user-history tr:nth-child(odd) {
          background-color: var(--disabled-text-color);
        }

        .add-or-remove {
          margin: 15px 0;
          padding: 15px 10px;
          border: 1px solid var(--border-light-color);
          border-radius: 5px;
          max-width: 300px;
        }

        .user {
          padding-bottom: 20px;
        }

        @media (min-width: 1024px) {
          .user {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .user-details {
            min-width: 200px;
            border-radius: 5px;
          }
        }

        .user-name {
          font-weight: bold;
        }

        .user-description {
          color: var(--secondary-text-color);
        }
      </style>
      <!-- Visualizzare la tipologia, il timestamp, il numero di punteggi assegnati, la reference -->
      <div class="container content">
        <div class="user">
          <div class="user-details">
            <h2 class="user-name">utente? [[userid]]</h2>
            <div class="user-description">---</div>
          </div>
          <div class="add-or-remove">
            <h3>Add or remove points</h3>

            <paper-input type="number"></paper-input>
            <paper-button raised primary class="icon-left">
              <iron-icon icon="hoverboard:add-circle-outline" class="icon-left"></iron-icon>
              <span>Add</span></paper-button
            >
            <paper-button
              ><iron-icon icon="hoverboard:remove-circle-outline" class="icon-left">-</iron-icon>
              <span>Remove</span></paper-button
            >
          </div>
        </div>
        <div>
          <table class="user-history">
            <tr>
              <th>Points</th>
              <th>Type</th>
              <th>Timestamp</th>
            </tr>
            <tr>
              <td>a</td>
              <td>b</td>
              <td>c</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.userid) store.dispatch(fetchGameHistory(this.userid));
  }

  @observe('gameHistory')
  gameHistoryChanged(gameHistory: GameHistoryState) {
    if (gameHistory instanceof Failure) {
      if ('permission-denied' === (gameHistory.error as any)?.code) {
        router.render('/games');
      }
    }
  }

  override stateChanged(state: RootState) {
    this.gameHistory = state.gamesHistory;
  }

  override disconnectedCallback(): void {
    console.log('disconnectedCallback');
    unsubscribe();
    super.disconnectedCallback();
  }
}
