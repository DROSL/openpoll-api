# OSOP API

**Our Simple Open Poll (OSOP)** is an open source web application for conducting polls and surveys with a special focus on data minimization and user privacy. It does not collect personal data, does not set tracking cookies, and does not outsource the service to third-party solutions, but runs entirely on your own server.

- [osop-api](https://github.com/DROSL/openpoll-api)
- [osop-frontend](https://github.com/DROSL/openpoll-api)

## Install

1. Clone the repository:

```sh
git clone https://github.com/DROSL/openpoll-api
```

2. Install required modules:

```sh
npm install
```

3. Install the [MongoDB server](https://www.mongodb.com/try/download/community).

4. Create an upload folder for user files, like `uploads/`.

## Configuration

### Environment variables

Set the following environment variables:

| Name | Type | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | string | Indicates whether the server is running on `development` or `production` mode. |
| `PORT` or `API_PORT` | number | The port on which the server listens. |
| `MONGODB_URI` | string | The URI of the MongoDB instance to connect to. ([Read more](https://www.mongodb.com/docs/v5.0/reference/connection-string/)) |
| `SESSION_SECRET` | string | The secret used to sign the session ID cookie. Sould be a random set of characters. ([Read more](https://www.npmjs.com/package/express-session#secret)) |

Note: You can use a `.env` file to set the environment variables. See [.env.sample](/.env.sample) as example.

### Config files

The config files are located in the [config/](/config/) directory and are loaded depending on the `NODE_ENV` environment variable. [default.json](/config/default.json) is always used as fallback. The following parameters can be configured:

```json
{
	"path": "/",
	"cookie": {
		"secure": true,
		"httpOnly": true
	},
	"upload": {
		"dest": "uploads/",
		"limits": {
			"fileSize": 104857600
		}
	}
}
```

## Usage

Run the server with:

```sh
npm start
```

## Testing

Import [postman.json](postman.json) to [Postman](https://www.postman.com/).

## Documentation

Please see the [documentation](/docs/README.md).

## License

Please see the [license](/LICENSE).

## Contributing

Before you commit, run:

```sh
npx prettier --write .
```