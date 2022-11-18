import * as functions from 'firebase-functions';
// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import axios from "axios";

interface InstagramConfiguration {
  instagramToken: string;
  instagramUserId: string;
  hashtagInstagramId: string;
  points: number;
}

interface Post {
  "id": string,
  "permalink": string
}

interface InstagramResponse {
  "data": Post[],
}

// export const scheduleInstagramScanner = functions.https.onRequest(async (req, res) => {
export const scheduleInstagramScanner = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
  const configurations: InstagramConfiguration = (await getFirestore()
    .collection('config')
    .doc('socialSearch')
    .get()).data() as InstagramConfiguration;
  const config = {
    method: 'get',
    // eslint-disable-next-line max-len
    url: `https://graph.facebook.com/v15.0/${configurations.hashtagInstagramId}/recent_media?fields=id,permalink&transport=cors&user_id=${configurations.instagramUserId}&access_token=${configurations.instagramToken}`,
  };

  axios(config)
    .then(async (response) => {
        const instagramResponse = response.data as InstagramResponse;
        if (instagramResponse.data.length > 0) {
          console.log('Instagram posts found ');
          for (const post of instagramResponse.data) {
            const doc = await getFirestore().collection('socialSearch').doc('instagram').collection('posts').doc(post.id).get();
            if (!doc.exists) {
              await getFirestore().collection('socialSearch').doc('instagram').collection('posts').doc(post.id).set(post);
            }
          }
        }
      }
    )
    .catch((error) => {
      console.log(error);
    });
});

export const instagramObserver = functions.firestore
  .document('socialSearch/instagram/posts/{postId}')
  .onWrite(async (change, context) => {
    const configurations: InstagramConfiguration = (await getFirestore()
      .collection('config')
      .doc('socialSearch')
      .get()).data() as InstagramConfiguration;
    const instagramPost: Post = (await getFirestore()
      .collection('socialSearch')
      .doc('instagram')
      .collection('posts')
      .doc(context.params.postId)
      .get()).data() as Post;
    const config = {
      method: 'get',
      url: `${instagramPost.permalink}?__a=1&__d=dis`,
    };
    axios(config).then(async (response) => {
      console.log(`handling post ${response.config.url}`);
      const postUser = response.data.graphql.shortcode_media.owner.username;
      const usersInGame = (await getFirestore()
        .collection('games')
        .where('instagram', 'in', [postUser])
        .get()).docs;
      const userInGame = usersInGame.length == 0 ? null : usersInGame[0];
      if (userInGame) {
        const hasPost = (await getFirestore()
          .collection('games')
          .doc(userInGame.id)
          .collection('history')
          .where('id', '==', instagramPost.id)
          .get()).docs.length > 0;
        if (!hasPost) {
          await getFirestore().collection('games').doc(userInGame.id).collection('history').add({
            insert_on: Timestamp.now(),
            type: 'INSTAGRAM',
            score: configurations.points,
            id: instagramPost.id,
            data: instagramPost
          });
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  });
