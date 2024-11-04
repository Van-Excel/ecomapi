import { Request, Response } from "express";
import { prismaClient } from "..";
import {compareSync, hashSync} from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET} from "../secrets";





export const signup = async (req:Request, res:Response) => {
    const {email, password, name} = req.body
    let user = await prismaClient.user.findFirst({ where: { email}});
    if (user) {
        res.status(400).json({ error: 'Email already exists' });
        throw Error('User already exists')
    };
    user = await prismaClient.user.create({
        data: {
            email,
            name,
            password: hashSync(password, 10),
        },
    })
    res.json(user)
}


export const login = async (req:Request, res:Response) => {
    const { email, password } = req.body;
    const user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
        throw Error('User does not exist');
    
    }
    if (!compareSync(password, user.password)) {
        throw Error('Incorrect password');
    }
    
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({ user,  token})

 }
