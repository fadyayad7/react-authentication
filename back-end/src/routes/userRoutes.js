import { getDbConnection } from "../db";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { tokenExpiration, jwtSecret, database } from "./config";
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
        
        const startingInfo = {
            hairColor: '',
            favoriteFood: '',
            bio: ''
        }
        
        const result = db.collection('users').insertOne({
            email,
            passwordHash,
            info: startingInfo,
            isVerified: false
        });
        
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

        const { id } = user;
        if (id !== userId) 
            return res.status(403).json({ message: 'can not edit this user 🥲'});
        
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