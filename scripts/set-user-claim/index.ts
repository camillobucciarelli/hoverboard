import { Claim, logUser, setCustomClaim } from "./claim-assignment";
import * as readline from 'readline';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Insert uid to raise as Organizer: ', (uid) => {
  setCustomClaim(Claim.ORGANIZER, uid)
    .then(() => logUser(uid))
    .catch((error) => console.log('Error! 💩', error));
  rl.close();
});
