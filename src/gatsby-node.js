const fetch = require("node-fetch");
const crypto = require("crypto");
const queryString = require("query-string");

const getAuthToken = async ({
  clientId,
  clientSecret,
  getRefreshToken,
  onRefreshTokenChanged
}) => {
  const refreshToken = await getRefreshToken();

  const params = queryString.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });

  const res = await fetch(
    `https://www.strava.com/api/v3/oauth/token?${params}`,
    {
      method: "POST"
    }
  );

  const token = await res.json();

  const newRefreshToken = token.refresh_token;

  if (refreshToken !== newRefreshToken) {
    await onRefreshTokenChanged(newRefreshToken);
  }

  return token.access_token;
};

exports.sourceNodes = async (
  { actions },
  {
    clientId,
    clientSecret,
    getRefreshToken,
    before,
    after,
    onRefreshTokenChanged
  }
) => {
  if (!clientId) {
    throw new Error(
      "You must provide an `clientId` to `gatsby-source-strava-activities`."
    );
  }

  if (!clientSecret) {
    throw new Error(
      "You must provide an `clientSecret` to `gatsby-source-strava-activities`."
    );
  }

  if (!getRefreshToken || typeof getRefreshToken !== "function") {
    throw new Error(
      "You must provide a function `getRefreshToken` to `gatsby-source-strava-activities`."
    );
  }

  if (!onRefreshTokenChanged || typeof onRefreshTokenChanged !== "function") {
    throw new Error(
      "You must provide a function `onRefreshTokenChanged` to `gatsby-source-strava-activities`."
    );
  }

  const authToken = await getAuthToken({
    clientId,
    clientSecret,
    getRefreshToken,
    onRefreshTokenChanged
  });

  const { createNode } = actions;

  const activities = [];
  let numResults = null;
  let page = 1;

  do {
    const params = queryString.stringify({
      after,
      before,
      page,
      per_page: 30
    });

    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?${params}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    // eslint-disable-next-line no-await-in-loop
    const data = await res.json();

    numResults = data.length;
    page += 1;

    data.forEach(d => {
      activities.push(d);
    });
  } while (numResults > 0);

  activities.forEach(activity => {
    const jsonString = JSON.stringify(activity);

    const gatsbyNode = {
      activity: Object.assign({}, activity),
      id: `Strava Activity: ${activity.id}`,
      parent: "__SOURCE__",
      children: [],
      internal: {
        type: "StravaActivity",
        contentDigest: crypto
          .createHash("md5")
          .update(jsonString)
          .digest("hex")
      }
    };

    createNode(gatsbyNode);
  });
};
