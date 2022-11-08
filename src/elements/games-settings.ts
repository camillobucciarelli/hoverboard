import { Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import '@polymer/paper-toggle-button/paper-toggle-button';
import { Player } from '../models/player';
import { RootState, store } from '../store';
import { setUserGamesSettings } from '../store/games/actions';
import { selectPlayerSettings } from '../store/games/selectors';
import { initialPlayerSettingsState } from '../store/games/state';
import { ReduxMixin } from '../store/mixin';
import { initialUserState } from '../store/user/state';
import './shared-styles';
import '../components/game-setting-social-block';

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

        #social-settings {
          display: table;
          width: 100%;
        }

        .social-row {
          display: table-row;
          width: 100%;
        }

        .social-cell {
          display: table-column;
          width: 50%;
          float:left;
          text-align: center;
        }

        .twitter-icon {
          color: var(--twitter-color);
        }

        .instagram-icon {
          color: var(--instagram-color);
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
        <template is="dom-if" if="[[playerSettings.plays]]">
          <div id="social-settings">
            <div class="social-row">
              <div class="social-cell">
                <game-setting-social-block
                  icon-color="var(--twitter-color)"
                  icon="hoverboard:twitter"
                  social-handle="[[playerSettings.twitter]]"
                  on-valuesaved="onTwitterChange"
                ></game-setting-social-block>
              </div>
              <div class="social-cell">
                <game-setting-social-block
                  icon-color="var(--instagram-color)"
                  icon="hoverboard:instagram"
                  social-handle="[[playerSettings.instagram]]"
                  on-valuesaved="onInstagramChange"
                ></game-setting-social-block>
              </div>
            </div>
          </div>
        </template>
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

  private onTwitterChange(event: CustomEvent) {
    if (this.user instanceof Success && this.playerSettings !== undefined) {
      this.playerSettings.twitter = event.detail.value;

      store.dispatch(setUserGamesSettings(this.user.data.uid, this.playerSettings));
    }
  }

  private onInstagramChange(event: CustomEvent) {
    if (this.user instanceof Success && this.playerSettings !== undefined) {
      this.playerSettings.instagram = event.detail.value;

      store.dispatch(setUserGamesSettings(this.user.data.uid, this.playerSettings));
    }
  }
}
