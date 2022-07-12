import { google } from 'googleapis';
import config from 'config';
import { GOOGLE } from '../types/config';

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_REDIRECT } = config.get('GOOGLE') as GOOGLE;
const googleClient = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

export default googleClient;
