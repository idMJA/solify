export const config = {
	tokenEndpoint:
		process.env.TOKEN_ENDPOINT ||
		"Hee, you forgot to set TOKEN_ENDPOINT in your .env file!", // you can use such as https://github.com/idMJA/accessify
	// server host/port for local hosting (defaults to 0.0.0.0:3000)
	port: Number(process.env.PORT || 3000),
	host: process.env.HOST || "0.0.0.0",
};
