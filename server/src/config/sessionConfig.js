// import session from 'express-session'
// import dotenv from 'dotenv'

// dotenv.config();

// if (!process.env.SESSION_SECRET) {
//     throw new Error('Environment variable SESSION_SECRET must be set')
// }

// export const sessionConfig = session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         maxAge: 1000 * 3600 * 24,
//         secure: false
//     }
// });