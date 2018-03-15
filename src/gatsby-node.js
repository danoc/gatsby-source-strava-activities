const fetch = require('node-fetch');
const crypto = require('crypto');
const queryString = require('query-string');

exports.sourceNodes = async (
  { boundActionCreators },
  { authToken, before, after },
) => {
  if (!authToken) {
    throw new Error('You must provide an `authToken` to `gatsby-source-strava-activities`.');
  }

  const { createNode } = boundActionCreators;

  const activities = [];
  let numResults = null;
  let page = 1;

  do {
    const params = queryString.stringify({
      after,
      before,
      page,
      per_page: 30,
    });

    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?${params}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    // eslint-disable-next-line no-await-in-loop
    const data = await res.json();

    numResults = data.length;
    page += 1;

    data.forEach((d) => {
      activities.push(d);
    });
  } while (numResults > 0);

  activities.forEach((activity) => {
    const jsonString = JSON.stringify(activity);

    const gatsbyNode = {
      activity: Object.assign({}, activity),
      id: `Strava Activity: ${activity.id}`,
      parent: '__SOURCE__',
      children: [],
      internal: {
        type: 'StravaActivity',
        contentDigest: crypto
          .createHash('md5')
          .update(jsonString)
          .digest('hex'),
      },
    };

    createNode(gatsbyNode);
  });
};
