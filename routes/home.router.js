const express = require('express');
const Users = require('../models/Users');
const session = require('express-session');
const router = express.Router();



const redirecttoDashboard = (req,res,next)=>{
    if(req.session.userid){
        res.redirect('/home');
    }else{
        next();
    }
}

const protectHome = (req,res,next)=>{
    if(!req.session.userid){
        res.redirect('/login');
    }else{
        next();
    }
}

router.get('/',redirecttoDashboard,(req,res)=>{
    res.render('login');
});

router.get('/home',protectHome,(req,res)=>{
   
    const username = req.session.userid;
    res.render('home',{username});
});

router.get('/login',redirecttoDashboard,(req,res)=>{
    res.render('login');
});

router.get('/register',redirecttoDashboard,(req,res)=>{
    res.render('register');
});


router.post('/register',(req,res)=>{
    const newUser = {
        id : Date.now().toString(),
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
    }
    
    var user = new Users(newUser);
    user.save();
    res.redirect('/login');
});

router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
   
    Users.findOne({email : email, password : password},(err,user)=>{
        if(!user){
            const msg = 'password incorrect';
            res.render('login',{msg});
        }else{
            req.session.userid = user.name;
            res.redirect('/home');
        }
    })
});
 
router.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.redirect('dashboard');
        }
        res.clearCookie('sid');
        res.redirect('/');
    })
});

module.exports =router;