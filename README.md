# json-store

A simple node app used to get or save json as files on disk in `data` directory.

URL format is `/json-store/:appId/:key.json`

The `appId` refers to a directory that you *must* first create in `data` directory to authorize file to be saved there.

`appId` and `key` are limited to 32 max characters (number, letters and `-`)

Payload are limited to 1 Mb by default (see `settings.json`).

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

Copy `src/settings.json.dist` to `src/settings.json` and update values :
- `port` for server port, which also can be set by `process.env.PORT`
- `origin`, used to populate `Access-Control-Allow-Origin` header, can be a string or an array. Values should *not* contains ending slash.


## Security

I’m advising you to deploy that app behind an nginx, configured with security headers (that’s why I’m not using helmet which is then redondary).

If you see any security issue, please contact me. See [paulgreg.me](https://paulgreg.me/) for contact infos and gpg key.