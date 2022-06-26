import { getDbConnection } from "../db";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { tokenExpiration, jwtSecret, database } from "./config";
import { randomUUID } from "crypto";
import { sendEmail } from '../utils/sendEmail';
import { getGoogleOauthUrl, getGoogleUser, updateOrCreateUserFromOauth } from "../utils/Google";
const ObjectID = require('mongodb').ObjectID;
//import ObjectID from 'mongodb'

export const signupRoute = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const {email, password} = req.body
        const db = getDbConnection(database); 
        const user = await db.collection('users').findOne({email});

        if (user) 
            return res.sendStatus(409);
        
        const passwordHash = await bcrypt.hash(password, 10); 
        const verificationString = randomUUID(); 
        
        const startingInfo = {
            hairColor: '',
            favoriteFood: '',
            bio: ''
        }
        
        const result = db.collection('users').insertOne({
            email,
            passwordHash,
            info: startingInfo,
            isVerified: false,
            verificationString
        });

        try {
            await sendEmail({to: email, from: 'fady.ayad7@gmail.com', subject: 'Please verify you email', text: `
                Thanks for signing up!, To verify your account, click here:
                http://localhost:3000/verify-email/${verificationString}
            `})
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
        
        const {insertedId} = result;
        jwt.sign({
            id: insertedId,
            email,
            info: startingInfo,
            isVerified: false
        }, jwtSecret, tokenExpiration, (error, token) => {
            error && res.status(500).send(error);
            res.status(200).json({token});
        })
    },
};

export const loginRoute = {
    path: '/api/login',
    method: 'post',
    handler: async (req, res) => {
        const {email, password} = req.body;
        const db = getDbConnection(database); 
        const user = await db.collection('users').findOne({email});
        const isCorrect = await bcrypt.compare(password, user?.passwordHash);

        if (!user || !isCorrect)
            return res.status(401).send('bad credentials 🥲')
        
        const {_id: id, isVerified, info} = user;
        
        jwt.sign({id, isVerified, email, info}, jwtSecret, tokenExpiration, (err, token) => {
            err && res.sendStatus(500);
            res.status(200).json({token});
        });
    }
}

export const updateUserInfoRoute = {
    path: '/api/users/:userId',
    method: 'put',
    handler: async (req, res) => {
        const { authorization } = req.headers;
        const { userId } = req.params;
        const db = getDbConnection(database);
        
        if (!authorization)
            return res.status(401).json({ message: 'no authorization found 😢'});

        const updates = (({
            favoriteFood,
            hairColor,
            bio
        }) => ({
            favoriteFood,
            hairColor,
            bio
        }))(req.body);


        let user = undefined;
        const token = authorization.split(' ')?.[1];
        await jwt.verify(token, jwtSecret, async (error, decode) => {
            if (error) return res.status(401).json({ message: 'no authorization found 🥲'});
            user = decode;
        });

        const { id, isVerified: verified} = user;
        if (id !== userId) 
            return res.status(403).json({ message: 'can not edit this user 🥲'});
        
        if (!verified) 
            return res.status(403).json({ message: 'please verify your account 🥲'});
        
        const result = await db.collection('users').findOneAndUpdate(
            {_id: ObjectID(id)},
            {$set: {info: updates}},
            {returnOriginal: false}
        );
        const { email, isVerified, info } = result?.value;
    
        jwt.sign({id, email, isVerified, info}, jwtSecret, tokenExpiration, (err, token) => {
            if (err) return res.status(500).json({ message: 'something went wrong 🥲'})
            return res.status(200).json({ token })
        })
    }
}

export const verifyEmailRoute = {
    path: '/api/users/verify-email',
    method: 'put',
    handler: async (req, res) => {
        const { verificationString } = req.body;
        const db = getDbConnection(database);
        const result = await db.collection('users').findOne({
            verificationString
        });
        
        if (!result) return res.status(401).json({ message: 'The email verification string is incorrect' });

        const {_id: id, email, info} = result;

        await db.collection('users').updateOne({_id: ObjectID(id)}, {
            $set: {isVerified: true}
        })

        jwt.sign({id, email, isVerified: true, info}, jwtSecret, tokenExpiration, (err, token) => {
            if (err) return res.status(500).json({ message: 'something went wrong 🥲'})
            return res.status(200).json({ token })
        })
    }
}

export const forgotPasswordRoute = {
    path: '/api/forgot-password/:email',
    method: 'put',
    handler: async (req, res) => {
        const {email} = req.params;
        const db = getDbConnection(database);
        const passwordResetCode = randomUUID();
        const {result} = await db.collection('users')
            .updateOne({email}, {$set: {passwordResetCode}});

        if (result.nModified > 0) {
            try {
                await sendEmail({to: email, from: 'fady.ayad7@gmail.com', subject: 'Password Reset', text: `
                    To reset your password, click this link:
                    http://localhost:3000/reset-password/${passwordResetCode}
                `})
            }catch(err) {
                console.log(err);
                return res.sendStatus(500)
            }
        }

        res.sendStatus(200);
    }
}

export const resetPassword = {
    path: '/api/users/:passwordResetCode/reset-password',
    method: 'put',
    handler: async (req, res) => {
        const {passwordResetCode} = req.params;
        const {password} = req.body;
        const db = getDbConnection(database);

        const passwordHash = await bcrypt.hash(password, 10); 
        const result = await db.collection('users')
            .findOneAndUpdate({passwordResetCode}, {$set: {passwordHash}, $unset: {passwordResetCode: ''}});

        
        if (result.lastErrorObject.n === 0) return res.sendStatus(404);

        return res.sendStatus(200)
    }
}

export const oauthRoute = {
    path: '/auth/google/url',
    method: 'get',
    handler: async (req, res) => {
        const url = getGoogleOauthUrl();
        res.status(200).json({url});
    }
}

export const googleOauthCallbackRoute = {
    path: '/auth/google/callback',
    method: 'get',
    handler: async (req, res) => {
        const {code} = req.query;
        const oauthUserInfo = await getGoogleUser({code});
        const updatedUser = await updateOrCreateUserFromOauth({oauthUserInfo});
        const {_id: id, isVerified, email, info} = updatedUser;

        jwt.sign(
            {id, isVerified, email, info},
            jwtSecret,
            (err, token) => {
                if (err) return res.sendStatus(500);
                return res.redirect(`http://localhost:3000/login?token=${token}`)
            }
        )
    }
}