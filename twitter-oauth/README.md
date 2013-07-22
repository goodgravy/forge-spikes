# OAuth for Twitter

Currently (July 2013), there are two main ways to use OAuth with Twitter: [application-only](https://dev.twitter.com/docs/auth/application-only-auth) access or [single-user access](https://dev.twitter.com/docs/auth/oauth/single-user-with-examples).

If possible, use application-only authentication, because it is OAuth 2.0 and therefore generally painless to implement.

This example app shows how to do OAuth 1.0a authentication against Twitter from a Trigger.io app.

## Usage
Update `window.oauth_consumer_key` and `window.consumerSecret` in `main.js` with values from your own app.

There are examples in the code for how to read those values in from the `parameters` module too, which you may prefer.

The core of the OAuth 1.0a authentication flow is the sequence of:
	
	POST https://api.twitter.com/oauth/request_token
	GET  https://api.twitter.com/oauth/authorize
	POST https://api.twitter.com/oauth/access_token

Which you can see towards the end of `main.js`. Once that sequence has successfully completed, a valid OAuth token and token secret have been acquired, and subsequent calls to `makeSignedRequest` should just work.
