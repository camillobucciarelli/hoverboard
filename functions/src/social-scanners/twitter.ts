import * as functions from 'firebase-functions';
// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import axios from "axios";

interface TwitterConfiguration {
  twitterToken: string;
  hashtag: string;
  points: number;
}

interface LastSearch {
  lastSearch: Timestamp;
}

interface Tweet {
  "author_id": string,
  "id": string,
  "text": string
}

interface User {
  "id": string,
  "name": string,
  "username": string
}

interface TweetsResponse {
  "data": Tweet[],
  "includes": {
    "users": User[]
  },
  "meta": {
    "newest_id": string,
    "oldest_id": string,
    "result_count": number
  }
}

export const scheduleTwitterScanner = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    const configurations: TwitterConfiguration = (await getFirestore()
      .collection('config')
      .doc('socialSearch')
      .get()).data() as TwitterConfiguration;
    const lastSearch: LastSearch = (await getFirestore()
      .collection('socialSearch')
      .doc('twitter')
      .get()).data() as LastSearch;
    const config = {
      method: 'get',
      // eslint-disable-next-line max-len
      url: `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(configurations.hashtag)}&start_time=${lastSearch.lastSearch.toDate().toISOString()}&max_results=100&expansions=author_id&user.fields=id,username`,
      headers: {
        'Authorization': `Bearer ${configurations.twitterToken}`,
      }
    };

    axios(config)
      .then(async (response) => {
          const tweetsResponse = response.data as TweetsResponse;
          await getFirestore()
            .collection('socialSearch')
            .doc('twitter')
            .set({ lastSearch: Timestamp.now() });
          const usersInGame = (await getFirestore()
            .collection('games')
            .where('twitter', 'in', tweetsResponse.includes.users.map(user => user.username))
            .get()).docs;
          for (const user of usersInGame) {
            const authorId = tweetsResponse
              .includes
              .users
              .find(userInResponse => userInResponse.username === user.data().twitter)
              .id;
            const userTweets = tweetsResponse.data.filter(tweet => tweet.author_id === authorId);
            if (userTweets.length > 0) {
              for (const tweet of userTweets) {
                const hasTweet = (await getFirestore()
                  .collection('games')
                  .doc(user.id)
                  .collection('history')
                  .where('tweetId', '==', tweet.id)
                  .get()).docs.length > 0;
                if (!hasTweet) {
                  await getFirestore().collection('games').doc(user.id).collection('history').add({
                    insert_on: Timestamp.now(),
                    type: 'TWITTER',
                    score: configurations.points,
                    tweetId: tweet.id,
                    data: tweet
                  });
                }
              }
            }
          }
        }
      )
      .catch(function (error) {
        console.log(error);
      });
  });
