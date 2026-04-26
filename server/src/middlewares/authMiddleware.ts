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
   
    const token = req.cookies.token as string | undefined;
    if(!token){
        return res.status(401).json({message:"Access token is missing"});
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string,(err,user) =>{
        if(err){
            res.clearCookie("token");
            return res.status(403).json({message:"Invalid or expired token"});
             
        }  
        req.user =user;
        next();
    })
}
