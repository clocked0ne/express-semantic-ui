# express-semantic-ui

> Node.js Express app boilerplate for a web frontend utilising Semantic UI

[![Build Status][travis-image]][travis-url]


## About

This is a Node.js [Express](https://www.npmjs.com/package/express) app boilerplate that uses [Gulp](https://www.npmjs.com/package/gulp) for build task running, [Swig](https://www.npmjs.com/package/swig) for templating and [Semantic UI](https://www.npmjs.com/package/semantic-ui) for design bootstrapping. The aim of this boilerplate is to get you off the ground very quickly with a full stack application.

Caveats are that to avoid writing in dependencies on databases or other external services, sessions are stored on the filesystem and there is no authentication (if you want that `npm install passport`).

The only exception to this is that the Gulp tasks include a CloudFront publisher to serve static assets from CDN instead of locally, if configured.

## Install

Requires Node.js, recommended `6.0.0` or greater

```bash
npm install
```

So simple, right?

## Usage

`views/index.html` and `views/dashboard.html` are provided by default as examples of a Semantic UI theme to get you started, along with associated server-side Express routes in `routes/index.js`.

Override or add CSS in `src/css/theme.css` and add your own Semantic UI JS calls to `src/js/semantic-ui.js`, or feel free to add additional javascript/CSS files as necessary, just be sure to add them to the `bundle.config.js` file Gulp Bundle uses.

To get started, copy the `config/example.config.js` file to `config/config.js` and fill in the values appropriately for this new file, most are self-explanatory:

```javascript
	requestLogging: false           // Logs all requests using Morgan
	session: {
		secret: 'defaultSecret',    // You should change this
		name: 'session'             // You should change this
	},
	gulpBuildMaps: false,           // Instructs Gulp Bundle to compile source maps
	frontend: {
		useCDN: false               // Will use API credentials from `cloudFrontS3` to publish to CDN
	}
```

**Do not commit your API credentials in config.js to a repository** - this is bad juju - either symlink to this file and deploy manually, use environment variables or modify and come up with your own secure mechanism for deployment.

Gulp tasks are configured for Semantic UI builds:

```bash
gulp watch      # watch for Semantic UI source changes
gulp clean      # Wipe the built dist/ folder
gulp build      # Build assets to dist/
```

To make these builds smaller, you can move components listed in `semantic.json` into the `disabled` section and they will not be incorporated in the build.

You should only need to run `gulp build` once unless you are making changes to the Semantic UI site theme, otherwise, run the following:

```bash
gulp wipe       # Wipe the public/ folder of assets
gulp compile    # Minify/concatenate source js/css from src/ into public/
gulp optimise   # Optimise/compress images from src/images/ into public/
```

If you are only making frequent javascript and CSS changes outside of Semantic UI, run `gulp compile`.

The following commands are combined tasks to build Semantic UI and your own assets:

```bash
gulp refresh    # Cleans and wipes (like a good 'un)
gulp bundle     # Builds and compiles
gulp publish    # Publishes to CDN
```

The default Gulp action is to refresh, bundle and optimise. Publishing is left as a separate action so you can incorporate it into your deployment process; build and/or publish together you can using the associated scripts:

```bash
npm run cdn     # gulp publish
npm run gulp    # gulp && gulp publish
```

This is enough to get you off the ground running, for full documentation please refer back to [Express](http://expressjs.com/en/4x/api.html), [Semantic-UI](http://semantic-ui.com/introduction/getting-started.html) and [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/README.md) documentation separately.

## Test

There is a basic series of tests provided using Mocha, Chai and Should. There is a breaking test to ensure you have a valid configuration file, anything else is down to you as a developer.

```bash
npm test
```

Enjoy! Feel free to fork and use for your own applications as the license permits.

## Notes

This uses a version locked dependency `gulp-header` of which the most recent version has a bug that breaks Gulp builds. Hopefully this can be removed at some point.

## License

```
The MIT License (MIT)

Copyright (c) 2016 clocked0ne

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[travis-url]: https://travis-ci.org/clocked0ne/express-semantic-ui
[travis-image]: https://travis-ci.org/clocked0ne/express-semantic-ui.svg
