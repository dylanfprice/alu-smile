# ALU Smile

Donate to the Amazon Labor Union when you shop on Amazon.com.

## Developing

Developing requires a recent version of [nodejs](https://nodejs.org) with npm.

First install dependencies:
```bash
npm install
```

To just produce a build of the app run:
```bash
npm run build
```
This will run linting, tests, and output bundles to the dist/ directory.

### Live Testing Environment

To start the live testing environment run:
```bash
npm run dev
```
Go to the address printed out by the server in your browser. You should see a sanitized version of the Amazon checkout page (this lives in the test-page/ folder).

As you make changes to the source code, the bundler will automatically rebuild the code.

Next you need to load the extension into your browser in development mode:
- [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)

Finally, go back to the checkout page running on localhost. Open up the browser's web console and reload the page. You should see a log line saying "alu-smile loaded"

The workflow for making changes is:
- Edit code, save and it auto rebuilds
- Reload the extension according to your browser's process (i.e. click the reload button)
- Reload the checkout page

> :warning: The "Place your order" button on the test page will _not_ send any requests to amazon.com, however it _will_ open the actblue donation page and make a donation if you are logged in. You can avoid this by enabling debug mode in the extension preferences.
