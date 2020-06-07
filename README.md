# gatsby-source-strava-activities

[![NPM version](https://badgen.net/npm/v/gatsby-source-strava-activities)](https://www.npmjs.com/package/gatsby-source-strava-activities) [![Test build status](https://github.com/danoc/gatsby-source-strava-activities/workflows/Test/badge.svg)](https://github.com/danoc/gatsby-source-strava-activities/actions?query=workflow%3ATest)

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

### How to use `getRefreshToken` and `onRefreshTokenChanged`

Strava removed support for long-lived access tokens in October 2019. Instead of a long-lived access token, Strava provides short-lived access tokens and refresh tokens. The refresh tokens are exchanged for new access tokens when the access tokens expire. During this exchange, the response includes a refresh token that may or may not be different than the one just used. When the refresh token changes, the old one stops working. Because of this, you’ll need to store the refresh token somewhere that you can retrieve and update it at build time.

To get started, get the first refresh token (with the `activity:read` scope) by visiting `https://www.strava.com/oauth/authorize?client_id=[client-id]&redirect_uri=[website]&response_type=code&scope=activity:read`. The `[website]` in that URL should be the site that is listed in [your Strava application](https://www.strava.com/settings/api). Once you click on "Authorize" you’ll get redirected to the `[website]` with a URL query parameter called `code`. The `code` is exchanged for a refresh token and short-lived access token with this command:

```bash
curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=ReplaceWithClientID \
  -d client_secret=ReplaceWithClientSecret \
  -d code=ReplaceWithCode \
  -d grant_type=authorization_code
```

Strava will respond like this if it succeeds:

```
{
  "token_type": "Bearer",
  "expires_at": 1568775134,
  "expires_in": 21600,
  "refresh_token": "e5n567567...",
  "access_token": "a4b945687g...",
  "athlete": {
    #{summary athlete representation}
  }
}
```

The `refresh_token` in that response should be stored somewhere that can be accessed by `getRefreshToken` and `onRefreshTokenChanged`. `getRefreshToken` should fetch the newest refresh token and `onRefreshTokenChanged` should store the refresh token when it changes. Take a look at [danoc/danoc.me for an example](https://github.com/danoc/danoc.me/blob/a3bfece818d2c91fb8a72a4d775275cb4d522dca/gatsby-config.js#L38-L65) of implementing this with Firebase.

You can use `allStravaActivity` to query the data in GraphQL once the plugin is set up. Here’s an example of a query that fetches an activity’s `name`, Strava `id`, and `distance`.

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
