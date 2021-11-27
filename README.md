# json-store

A simple node app used to get or save json as files on disk in `data`.

You must first create a directory in `data` to « allow » json to be saved inside. 

Payload are limited to 1 Mb.

## Limitations

That app is a very simple JSON store for little and personal use. It is not designed to handle multiple users, especially if concurrent access are expected.

## Configuration

Copy `src/settings.json.dist` to `src/settings.json` and update values :
- `port` for server port, which also can be set by `process.env.PORT`
- `origin`, used to populate `Access-Control-Allow-Origin` header, can be a string or an array. Values should *not* contains ending slash.


## Security

I’m advising you to deploy that app behind an nginx, configured with security headers (that’s why I’m not using helmet which is then redondary).

If you see any security issue, please contact me. See [paulgreg.me](https://paulgreg.me/) for contact infos and gpg key.