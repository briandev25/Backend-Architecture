import type{ Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export const authenticateToken =(req:Request,res:Response,next:NextFunction)  =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Access token is missing"});
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string,(err,user) =>{
        if(err){
            return res.status(403).json({message:"Invalid or expired token"});
        }
        req.user =user;
        next();
    })
}
