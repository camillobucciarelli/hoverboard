import * as functions from 'firebase-functions';
// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { getFirestore } from "firebase-admin/firestore";

export const updateScore = functions.firestore
  .document('games/{playerId}/history/{historyId}')
  .onWrite(async (change, context) => {
    const docs = await getFirestore().collection('games').doc(context.params.playerId).collection('history').get();
    const score = docs.docs.reduce((acc, doc) => acc + doc.data().points, 0);
    return getFirestore().collection('games').doc(context.params.playerId).update({ score: score });
  });
