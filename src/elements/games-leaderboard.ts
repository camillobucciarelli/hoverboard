import { Initialized, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
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
import '@polymer/paper-input/paper-input.js';
@customElement('games-leaderboard')
export class GamesLeaderboard extends ReduxMixin(PolymerElement) {
  @property({ type: String })
  search: string = '';

  @computed('search', 'leaderboard')
  get filteredLeaderboard() {
    return this.leaderboard.filter((player) =>
      player.name?.toLowerCase().includes(this.search.toLowerCase())
    );
  }

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
          background-color: var(--google-grey-100);
        }

        #leaderboard tr {
          border: 1px solid var(--border-light-color);
          padding: 0.35em;
        }

        #leaderboard th,
        #leaderboard td {
          padding: 0.625em;
          text-align: center;
        }

        #leaderboard th {
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media screen and (max-width: 600px) {
          #leaderboard {
            border: 0;
          }

          #leaderboard thead {
            border: none;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
          }

          #leaderboard tr {
            border-bottom: 3px solid #ddd;
            display: block;
            margin-bottom: 0.625em;
          }

          #leaderboard td {
            border-bottom: 1px solid #ddd;
            display: block;
            font-size: 0.8em;
            text-align: right;
          }

          #leaderboard td::before {
            content: attr(data-label);
            float: left;
            font-weight: bold;
            text-transform: uppercase;
          }

          #leaderboard td:last-child {
            border-bottom: 0;
          }
        }
      </style>

      <h1>Leaderboard</h1>

      <paper-input value="{{search}}" name="point" label="Name filter"></paper-input>

      <table id="leaderboard">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
            <template is="dom-if" if="[[isOrganizer]]">
              <th scope="col">Actions</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template is="dom-repeat" items="[[filteredLeaderboard]]" as="player">
            <tr>
              <td data-label="Name">[[player.name]]</td>
              <td data-label="Score">[[player.score]]</td>
              <template is="dom-if" if="[[isOrganizer]]">
                <td data-label="Actions">
                  <a href="/games/[[player.id]]">Edit</a>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    `;
  }

  @property({ type: Object })
  players = initialPlayersState;
  @property({ type: Array })
  leaderboard: Player[] = [];
  @property({ type: Array })
  isOrganizer: boolean = false;

  override stateChanged(state: RootState) {
    this.players = state.players;

    if (state.user instanceof Success) {
      this.isOrganizer = state.user.data.claims.role === 'ORGANIZER';
    }

    if (this.players instanceof Initialized) {
      store.dispatch(fetchPlayers);
    }

    if (this.players instanceof Success) {
      this.leaderboard = selectLeaderboard(state);
    }
  }
}
