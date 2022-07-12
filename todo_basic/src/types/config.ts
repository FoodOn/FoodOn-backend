import { Secret } from 'jsonwebtoken';

export type DB = {
    DB_DATABASE: string,
    DB_USER: string,
    DB_PASSWORD: string,
    DB_HOST: string,
    DB_PORT: number
};

export type SERVER = {
    SERVER_PORT: number,
    SERVER_JWT_SECRET_KEY: Secret,
    SERVER_DOMAIN: string,
};

export type GOOGLE = {
    GOOGLE_CLIENT_ID: string,
    GOOGLE_SECRET: string,
    GOOGLE_REDIRECT: string
}
