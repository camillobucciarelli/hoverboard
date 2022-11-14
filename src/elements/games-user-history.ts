import { Failure, Success } from '@abraham/remotedata';
import { computed, customElement, observe, property } from '@polymer/decorators';
import '@polymer/iron-icon/';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import { Timestamp } from 'firebase/firestore';

import '../components/markdown/short-markdown';
import '../components/text-truncate';
import { router } from '../router';
import { RootState, store } from '../store';
import {
  changeManually,
  fetchGameHistory,
  fetchPlayer,
  unsubscribe,
} from '../store/game-history/actions';
import { GameHistoryState } from '../store/game-history/state';
import { Player } from '../store/game-history/types';
import { unsubscribe as unsubscribeGames } from '../store/games/actions';
import { ReduxMixin } from '../store/mixin';
import './shared-styles';

@customElement('games-user-history')
export class GamesUserHistory extends ReduxMixin(PolymerElement) {
  @property({ type: String })
  userid: string | undefined;

  @property({ type: Array })
  gameHistory: any[] = [];

  @property({ type: Number })
  points: number = 0;

  @property({ type: Boolean })
  isOrganizer: boolean = false;

  @property({ type: Object })
  player: Player | null = null;

  private removePoints() {
    if (this.userid && this.points > 0 && !isNaN(this.points)) {
      changeManually(this.userid, {
        points: -Number(this.points),
        type: 'BY_HAND',
        ref: 'ADMIN',
        timestamp: Timestamp.now(),
      });
    }
  }

  private addPoints() {
    // TODO implement action to add points
    if (this.userid && this.points > 0 && !isNaN(this.points)) {
      changeManually(this.userid, {
        points: Number(this.points),
        type: 'BY_HAND',
        ref: 'ADMIN',
        timestamp: Timestamp.now(),
      });
    }
  }

  @computed('gameHistory')
  get totalPoints() {
    return this.gameHistory.reduce((acc, item) => acc + item.points, 0);
  }

  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        .game-user-history {
          display: flex;
          flex-direction: column;
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
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 15px 10px;
          border: 1px solid var(--border-light-color);
          background-color: white;
          border-radius: 5px;
          width: 100%;
        }

        .action-buttons {
          text-align: right;
        }

        .user {
          order: 2;
          position: sticky;
          bottom: 0;
          width: 100%;
        }

        @media (min-width: 1024px) {
          .user {
            display: flex;
            align-items: center;
            gap: 15px;
            order: 0;
            position: static;
            padding-bottom: 20px;
          }

          .action-buttons {
            text-align: left;
          }

          .add-or-remove {
            max-width: 450px;
            margin: 15px 0;
            padding: 15px 20px;
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
      <div class="container content game-user-history">
        <div class="user">
          <div class="add-or-remove">
            <div class="user-details">
              <h2 class="user-name">[[player.name]]</h2>
              <!-- <div class="user-description">#[[userid]]</div> -->
              <div>
                <span class="user-description">Total points: </span>
                <span class="user-name">[[totalPoints]]</span>
              </div>
            </div>
            <paper-input
              label="Add or remove points"
              value="{{points}}"
              name="point"
              type="number"
            ></paper-input>
            <div class="action-buttons">
              <paper-button on-click="addPoints" raised primary class="icon-left">
                <iron-icon icon="hoverboard:add-circle-outline" class="icon-left"></iron-icon>
                <span>Add</span></paper-button
              >
              <paper-button on-click="removePoints"
                ><iron-icon icon="hoverboard:remove-circle-outline" class="icon-left">-</iron-icon>
                <span>Remove</span></paper-button
              >
            </div>
          </div>
        </div>
        <div>
          <table class="user-history">
            <tr>
              <th>Points</th>
              <th>Type</th>
              <th>Ref</th>
              <th>Timestamp</th>
            </tr>
            <template is="dom-repeat" items="[[gameHistory]]" as="item">
              <tr>
                <td>[[item.points]]</td>
                <td>[[item.type]]</td>
                <td>[[item.ref]]</td>
                <td>[[item.timestamp.date]] [[item.timestamp.time]]</td>
              </tr>
            </template>
          </table>
        </div>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.userid) {
      console.log('userid', this.userid);
      store.dispatch(fetchGameHistory(this.userid));
      store.dispatch(fetchPlayer(this.userid));
    }
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
    if (state.user instanceof Success) {
      this.isOrganizer = state.user.data.claims.role === 'ORGANIZER';
    }

    if (state.gamesHistory instanceof Success) {
      this.gameHistory = state.gamesHistory.data.map((item) => {
        const date = item.timestamp.toDate();
        return {
          ...item,
          timestamp: { date: date.toLocaleDateString(), time: date.toLocaleTimeString() },
        };
      });
    }

    if (!state.player.isLoading && state.player.data) {
      this.player = state.player.data;
    }
  }

  override disconnectedCallback(): void {
    unsubscribe();
    unsubscribeGames();
    super.disconnectedCallback();
  }
}
