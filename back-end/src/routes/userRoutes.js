import { getDbConnection } from "../db";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { tokenExpiration, jwtSecret } from "./config";

export const signupRoute = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const {email, password} = req.body
        const db = getDbConnection('mongodb'); 
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
        const db = getDbConnection('mongodb'); 
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