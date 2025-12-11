const https = require("https");
const querystring = require("querystring");

const TOKEN_URL = "https://accounts.spotify.com/api/token";

exports.handler = async function handler() {
	const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

	if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
		return jsonResponse(500, { error: "Missing Spotify credentials" });
	}

	const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
	const body = querystring.stringify({ grant_type: "client_credentials" });

	try {
		const data = await requestToken(basicAuth, body);
		return jsonResponse(200, { access_token: data.access_token, expires_in: data.expires_in });
	} catch (error) {
		return jsonResponse(500, { error: "Spotify token request failed", details: error.message || error });
	}
};

function requestToken(basicAuth, body) {
	return new Promise((resolve, reject) => {
		const req = https.request(
			TOKEN_URL,
			{
				method: "POST",
				headers: {
					Authorization: `Basic ${basicAuth}`,
					"Content-Type": "application/x-www-form-urlencoded",
					"Content-Length": Buffer.byteLength(body),
				},
			},
			(res) => {
				let raw = "";
				res.on("data", (chunk) => (raw += chunk));
				res.on("end", () => {
					try {
						const parsed = JSON.parse(raw);
						if (res.statusCode >= 200 && res.statusCode < 300) {
							resolve(parsed);
						} else {
							reject(parsed.error_description || parsed);
						}
					} catch (err) {
						reject(err);
					}
				});
			}
		);

		req.on("error", reject);
		req.write(body);
		req.end();
	});
}

function jsonResponse(statusCode, body) {
	return {
		statusCode,
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	};
}
