// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  wordpressShopUrl: 'https://fae.zra.mybluehost.me/shop',
  wordpressShopUrlLocal: 'http://localhost:8887/shop',
  origin: 'https://fae.zra.mybluehost.me',
  wcEndpoint: '/wp-json/wc/v2',
  woocommerce: {
    consumer_key: "ck_9d03eb62b6399886342fe629ce39a162593d74c7",
    consumer_secret: "cs_f420b92d90138bfa9f2ef6c5e9dcf8dcae386b3b"
  },
  wordpress: {
    api_url: 'https://fae.zra.mybluehost.me/wp-json/wp/v2/',
    auth_url: 'https://fae.zra.mybluehost.me/wp-json/jwt-auth/v1/token'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
