import jwt from 'jsonwebtoken';
import config from './config';

const getToken = (user) => {
    return (jwt.sign({
        //_id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
    }, config.JWT_SECRET, {
        expiresIn:'24h'
    }
    ))
}

const isAuth = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token) {
        const onlyToken = token.slice(7, token.length);
        jwt.verify(onlyToken, config.JWT_SECRET, (err, decode)=>{
            if(err)
            {
                return res.status(403).send({msg: 'Invalid Token.'});
            }
            req.user = decode;
            next();
            return
        })
    }
    else
    {
        return res.status(401).send({msg: 'Token is not supplied.'});
    }    
}

const isAdmin = (req, res, next) =>{
    if(req.user && parseInt(req.user.isAdmin) == 1){
        return next();

    }
    else
    {
        return res.status(401).send({msg: ' Admin Token is not valid.'})
    }
}
    

export {getToken, isAuth, isAdmin}