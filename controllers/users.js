import mongoose from 'mongoose';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';


export const login = async (req, res) =>{

    // const user ={
    //     mail: 'prueba@usuario.com',
    //     password: 'password'
    // }

    const user = req.body

    console.log('reqbody: ', req.body)

    try{

        var userLogin = await User.find({
                                        mail: user.mail,
                                        password: user.password,
                                    }).exec()

        if(userLogin.length>0){

            const token = jwt.sign({user: userLogin}, 'secretkey')
            res.status(200).json({error:0, token, user:userLogin[0]})
            
        }else{
            console.log('Not found')
            res.json({error: 1, message: "User not found."})
        }
        

        
    }catch(error){
        res.status(404).json({message: error.message})
    }

    // jwt.sign()

}

