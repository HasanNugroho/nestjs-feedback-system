import { version } from "os";

export default () => ({
    env: process.env.NODE_ENV || 'development',
    version: process.env.VERSION || version(),
    name: process.env.APP_NAME || 'NestJS App',
    desc: process.env.APP_DESC || 'NestJS Application',
    port: parseInt(process.env.PORT || '3000', 10),
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
        expired: process.env.JWT_EXPIRES_IN || '1h',
    },
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3000', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        name: process.env.DB_NAME,
    },
    reminder: {
        defaultDays: parseInt(process.env.REMINDER_DEFAULT_DAYS || '7', 10),
    },
});