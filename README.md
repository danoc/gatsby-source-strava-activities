# gatsby-source-strava-activities

A Gatsby plugin that fetches athlete activities from Strava’s `/athlete/activities` endpoint. [Learn more about the endpoint](https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities).

This plugin requires Gatsby v2.

## Usage

1.  Install `gatsby-source-strava-activities` in your project with `yarn add gatsby-source-strava-activities` or `npm install gatsby-source-strava-activities`.
2.  Add the plugin to your `gatsby-config.js` file:
    ```js
    {
      resolve: "gatsby-source-strava-activities",
      options: {
        // This is the "Access Token" from:
        // https://www.strava.com/settings/api
        authToken: '',
        // [Optional] An epoch timestamp to use for filtering activities that have taken place after a certain time.
        after: '',
        // An epoch timestamp to use for filtering activities that have taken place before a certain time.
        before: '',
       }
    }
    ```
3.  The plugin will store the Strava API response in Gatsby. You can grab the activities with a query such as:
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
