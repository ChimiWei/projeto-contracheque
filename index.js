if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const app = express();

const path = require('path')
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))


const initializePassport = require('./passport-config')
initializePassport(passport, 
    email => user.find(user => user.email === email),
    id => user.find(user => user.id === id)
    )

const mysql = require('./db_connection');
const req = require('express/lib/request');

var users = []


mysql.query(`select * from user`, (err, result, fields)=> {
    if (err) throw err;
    user = JSON.parse(JSON.stringify(result))
    
    console.log(user)
}) 



app.use(express.urlencoded({ extended: false}))

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.engine('html', require('ejs').renderFile);



app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.username})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
    
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})



app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let sql = `INSERT INTO user VALUES (default, '${req.body.name}', '${req.body.email}', '${hashedPassword}', default)`
        mysql.query(sql, (err) => {
            if(err) throw err;
           
        })
        /* const user = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword}
        
        users.push(user)
        */
        
    } catch {
        res.redirect('/register')
    }

    res.redirect('/login')
})


app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
       return next()
   }
  
 res.redirect('/login')
}


function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
       return res.redirect('/')
    }
    next()
}


app.listen(3000, () => {
    console.log('Servidor está funcionando')
});