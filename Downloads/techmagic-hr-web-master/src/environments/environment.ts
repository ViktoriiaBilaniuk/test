// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  apiEndpoint: 'http://techmagic-hr-api-dev.eu-central-1.elasticbeanstalk.com/v1',
  // apiEndpoint: 'http://localhost:3000/v1',
  googleAuth: 'http://techmagic-hr-web.s3-website.eu-central-1.amazonaws.com/google-auth',
  // googleAuth: 'http://localhost:4200/google-auth'
};
