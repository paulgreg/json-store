# json-store

A simple node app used to get or save json as files on disk in `data` directory.

URL format is `/json-store/:appId/:key.json`

The `appId` refers to a directory that you *must* first create in `data` directory to authorize file to be saved there.

`appId` and `key` are limited to 32 max characters (number, letters and `-`)

Payload are limited to 1 Mb by default.

Supported methods are :
- `GET` to `:appId/:key.json` which returns JSON from file if found or 404 otherwise
- `POST` to `:appId/:key.json` with `content-type: application/json` and JSON payload in body to write that JSON to existing or new file
- `OPTIONS` to handle CORS


If you file is an array, you can use add or delete methods : 

- `POST` to `:appId/add/:key.json` with `content-type: application/json` and JSON payload (object or array) in body to append data to existing or new file
- `POST` to `:appId/del/:key.json` with `content-type: application/json` and JSON payload (object or array) in body to remove data from existing file


## Limitations

That app is a very simple JSON store for little and personal use. It is not designed to handle multiple users, especially if concurrent access are expected.


## Configuration

Copy `.env.dist` to `.env` and update values :
- `PORT` for server port, which also can be set by `process.env.PORT`
- `ORIGIN`, used to populate `Access-Control-Allow-Origin` header, can be single value or multiple values separated by comma. Values should *not* contains ending slash
- `AUTH_USER`
- `AUTH_PASSWORD` should be updated using a long 64 characters password.
- `UPLOAD_LIMIT`


## Security

Each incoming request should add a `authorization` Basic HTTP header.

A secret is shared between json-store and each app calling it. 
The username and password is stored in `settings.json`. App is encoding it via base64 at startup.

That security measure is only usefull for personnal use (like personal webapps calling the store). It’s a very basic protection to avoid filling the store by random internet users.

I’m advising you to deploy that app behind an nginx, configured with security headers (that’s why I’m not using helmet which is then redondary).

If you see any security issue, please contact me. See [paulgreg.me](https://paulgreg.me/) for contact infos and gpg key.