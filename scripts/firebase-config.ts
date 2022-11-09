// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { getFirestore } from 'firebase-admin/firestore';
// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '../serviceAccount.json';

const credential = cert(serviceAccount as ServiceAccount);
initializeApp({ credential });
const firestore = getFirestore();
const auth = getAuth();

export { firestore, auth };
