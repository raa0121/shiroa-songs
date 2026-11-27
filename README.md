# shiroa-songs

Source code of https://shiroa-songs.raa0121.info/

The setlist is fetched from Google Apps Script at build time and served as
`/data.json`.

## Running

You need to have Deno v2.0.0 or later installed to run this repo.

Start a dev server:

```
$ deno task dev
```

## Deploy

The app is served from Cloudflare Workers at https://shiroa-songs.raa0121.info/.
Pushing to `master` deploys it through GitHub Actions, which needs the
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. Run the
workflow manually to pick up setlist changes without a code change.

Build and run it in the local Workers runtime:

```
$ deno task cf:dev
```

Build and deploy from your machine:

```
$ deno run -A npm:wrangler@^4 login
$ deno task deploy
```

## License

MIT

## Author

raa0121
