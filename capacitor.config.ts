import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ion.wordpress.uk',
  appName: 'ion-wordpress',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
