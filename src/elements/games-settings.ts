import { Initialized, Success } from '@abraham/remotedata';
import { customElement, observe, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/markdown/short-markdown';
import '../components/text-truncate';
import '@polymer/paper-toggle-button/paper-toggle-button';
import { Player } from '../models/player';
import { RootState, store } from '../store';
import { fetchPlayers, fetchPlayerSettings, setUserGamesSettings } from '../store/games/actions';
import { selectLeaderboard, selectPlayerSettings } from '../store/games/selectors';
import { initialPlayerSettingsState, initialPlayersState } from '../store/games/state';
import { ReduxMixin } from '../store/mixin';
import { initialUserState } from '../store/user/state';
import './shared-styles';

@customElement('games-settings')
export class GamesSettingsboard extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        paper-toggle-button.green {
          --paper-toggle-button-checked-bar-color:  var(--default-primary-color);
          --paper-toggle-button-checked-button-color:  var(--default-primary-color);
          --paper-toggle-button-checked-ink-color: var(--default-primary-color);
        }

        .settings {
          margin-bottom: 40px;
        }
      </style>
      
      <h1>Settings</h1>
      <div class="settings">
        <paper-toggle-button 
          class="green"
          checked="[[playerSettings.plays]]"
          on-click="togglePlays"
        >
            I want to play!
        </paper-toggle-button>
      <div>
    `;
  }

  @property({ type: Object })
  playerSettingsState = initialPlayerSettingsState;
  @property({ type: Object })
  user = initialUserState;
  @property({ type: Array })
  playerSettings: Player | undefined;
  @property({ type: Boolean })
  private signedIn = false;

  override stateChanged(state: RootState) {
    super.stateChanged(state);
    this.user = state.user;
    this.playerSettingsState = state.playerSettings;
    this.signedIn = state.user instanceof Success;
    
    if (this.user instanceof Success) {
      this.playerSettings = selectPlayerSettings(state);
    }
  }

  private togglePlays(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.user instanceof Success && this.playerSettings !== undefined) {
      this.playerSettings.plays = !this.playerSettings.plays;

      store.dispatch(setUserGamesSettings(this.user.data.uid, this.playerSettings));
    }
  }
}
