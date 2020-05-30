# gatsby-source-strava-activities

[![NPM version](https://badgen.net/npm/v/gatsby-source-strava-activities)](https://www.npmjs.com/package/gatsby-source-strava-activities) [![Build status](https://badgen.net/travis/danoc/gatsby-source-strava-activities)](https://travis-ci.com/danoc/gatsby-source-strava-activities)

A Gatsby plugin that fetches athlete activities from Strava’s `/athlete/activities` endpoint. [Learn more about the endpoint](https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities).

## Usage

Install `gatsby-source-strava-activities` in your project:

```
yarn add gatsby-source-strava-activities
npm install gatsby-source-strava-activities
```

Then add the plugin to your `gatsby-config.js` file:

```js
{
  resolve: "gatsby-source-strava-activities",
  options: {
    // `getRefreshToken` must look up and return the refresh token as a string.
    getRefreshToken: async () => {},
    // `onRefreshTokenChanged` runs each time the access token expired and
    // needed to be refreshed. It receives the new refresh token which must be
    // stored. It will be needed again next time the token expires.
    onRefreshTokenChanged: async (newRefreshToken) => {},
    // [Optional] An epoch timestamp to use for filtering activities that have
    // taken place after a certain time.
    after: '',
    // An epoch timestamp to use for filtering activities that have taken place
    // before a certain time.
    before: '',
  }
}
```

The plugin will store the Strava API response in Gatsby. Here's an example of a query that fetches an activity’s `name`, Strava `id`, and `distance`.

```js
{
  allStravaActivity {
    edges {
      node {
        activity {
          name
          id
          distance
        }
      }
    }
  }
}
```

The node contains the [entire response from Strava’s endpoint](https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities).
