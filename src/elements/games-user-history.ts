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
          min-height: 100vh;
          justify-content: space-between;
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
          background-color: var(--google-grey-100);
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

        .user-history {
          border: 1px solid #ccc;
          border-collapse: collapse;
          margin: 0;
          padding: 0;
          width: 100%;
          table-layout: fixed;
        }

        .user-history tr {
          border: 1px solid var(--border-light-color);
          padding: 0.35em;
        }

        .user-history th,
        .user-history td {
          padding: 0.625em;
          text-align: center;
        }

        .user-history th {
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media screen and (max-width: 600px) {
          .user-history {
            border: 0;
          }

          .user-history caption {
            font-size: 1.3em;
          }

          .user-history thead {
            border: none;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
          }

          .user-history tr {
            border-bottom: 3px solid #ddd;
            display: block;
            margin-bottom: 0.625em;
          }

          .user-history td {
            border-bottom: 1px solid #ddd;
            display: block;
            font-size: 0.8em;
            text-align: right;
          }

          .user-history td::before {
            content: attr(data-label);
            float: left;
            font-weight: bold;
            text-transform: uppercase;
          }

          .user-history td:last-child {
            border-bottom: 0;
          }
        }

        @media (min-width: 1024px) {
          .game-user-history {
            min-height: initial;
          }

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
            <thead>
              <tr>
                <th scope="col">Points</th>
                <th scope="col">Type</th>
                <th scope="col">Ref</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <template is="dom-repeat" items="[[gameHistory]]" as="item">
                <tr>
                  <td data-label="Points">[[item.points]]</td>
                  <td data-label="Type">[[item.type]]</td>
                  <td data-label="Ref">[[item.ref]]</td>
                  <td data-label="Timestamp">[[item.timestamp.date]] [[item.timestamp.time]]</td>
                </tr>
              </template>
            </tbody>
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
