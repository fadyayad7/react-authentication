import {google} from 'googleapis';
import axios from 'axios';
import { getDbConnection } from '../db';
import { database } from '../routes/config';

export const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:8080/auth/google/callback'
);

export const getGoogleOauthUrl = () => {
    const scope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    return oauthClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope
    })
}

export const getAccessAndBearerUrl = ({accessToken}) => `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;

export const getGoogleUser = async ({ code }) => {
    const { tokens } = await oauthClient.getToken(code);
    const response = await axios.get(
        getAccessAndBearerUrl({ accessToken: tokens.access_token}),
        { headers: {Authorization: `Bearer ${tokens.id_token}`}}
    );
    return response.data;
}

export const updateOrCreateUserFromOauth = async ({ oauthUserInfo }) => {
    const {
        id: googleId,
        verified_email: isVerified,
        email
    } = oauthUserInfo;

    const db = getDbConnection(database);
    const existingUser = await db.collection('users').findOne({email});
    if (existingUser){
        const user = await db.collection('users').findOneAndUpdate(
            { email },
            { $set: {googleId, isVerified}},
            { returnOriginal: false}
        );
        return user.value;
    } else {
        const user = await db.collection('users').insertOne({
            email,
            googleId,
            isVerified,
            info: {}
        });
    }
}