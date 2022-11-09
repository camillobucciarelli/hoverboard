import { Initialized, Success } from '@abraham/remotedata';
import { customElement, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/markdown/short-markdown';
import '../components/text-truncate';
import { Player } from '../models/player';
import { RootState, store } from '../store';
import { fetchPlayers } from '../store/games/actions';
import { selectLeaderboard } from '../store/games/selectors';
import { initialPlayersState } from '../store/games/state';
import { ReduxMixin } from '../store/mixin';
import './shared-styles';

@customElement('games-leaderboard')
export class GamesLeaderboard extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        #leaderboard {
          padding: 0 80px;
          width: 100%;
          border-collapse: collapse;
          border: none;
        }

        #leaderboard tr th {
          background-color: var(--default-primary-color);
          color: var(--text-primary-color);
          padding: 5px;
        }

        #leaderboard tr td {
          padding: 5px;
          text-align: center;
        }

        #leaderboard tr:nth-child(odd) {
          background-color: var(--disabled-text-color);
        }
      </style>

      <h1>Leaderboard</h1>

      <table id="leaderboard">
        <tr>
          <th>Name</th>
          <th>Score</th>
          <!-- TODO: this part should be visible only for ORGANIZER USER -->
          <th>Actions</th>
        </tr>

        <template is="dom-repeat" items="[[leaderboard]]" as="player">
          <tr>
            <td>[[player.name]]</td>
            <td>[[player.score]]</td>
            <!-- TODO: this part should be visible only for ORGANIZER USER -->
            <td>
              <a href="/games/[[player.id]]">Edit</a>
            </td>
          </tr>
        </template>
      </table>
    `;
  }

  @property({ type: Object })
  players = initialPlayersState;
  @property({ type: Array })
  leaderboard: Player[] = [];

  override stateChanged(state: RootState) {
    this.players = state.players;

    if (this.players instanceof Initialized) {
      store.dispatch(fetchPlayers);
    }

    if (this.players instanceof Success) {
      this.leaderboard = selectLeaderboard(state);
    }
  }
}
