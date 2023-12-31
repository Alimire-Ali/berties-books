module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        res.send("You searched for: " + req.query.keyword);
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });                                                                                                 
    app.post('/registered', function (req,res) {
        // saving data in database
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            // Store hashed password in your database.
            console.log(hashedPassword);

            let sqlquery = "INSERT INTO registration (first, last, email, username, hashedPassword) VALUES (?,?,?,?,?)";
            // execute sql query
            let newrecord = [req.body.first, req.body.last, req.body.email, req.body.username, hashedPassword];
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                return console.error(err.message);
                }
                else
                res.send(' Your details have been added to the database, name: '+ req.body.first + ' ' + req.body.last + ' Your email is: ' + req.body.email + ' Your password is: '+ req.body.password + ' Your hashed password is: ' + hashedPassword );
                });

          })

    }); 
    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);                                                                     
    });
    app.post('/loggedin', function (req,res) {
        const bcrypt = require('bcrypt');

        let sqlquery = "SELECT hashedPassword FROM registration WHERE username = ? ";
        let lgdetails = [req.body.username];
        db.query(sqlquery, lgdetails, (err, result) => {
            console.log(result);
            if (err){
                return console.error(err.message);
            }
            else {
                const hashedPassword = result[0].hashedPassword;
                bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                    // console.log(result);
                    if (err) {
                      // TODO: Handle error
                      return console.error(err.message);
                    }
                    else if (result == true) {
                      // TODO: Send message
                      res.send('You are now Logged in!');
                    }
                    else {
                      // TODO: Send message
                      res.send('Incorrect Login!');
                    }
                  }); 
            }
            
        });      
    })
    

    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => { 
        if (err) {
        res.redirect('./'); 
    } 
    let newData = Object.assign({}, shopData, {availableBooks:result});
    console.log(newData)
    res.render("list.ejs", newData) 
    });
    });

    app.get('/listeners', function(req, res) {
        let sqlquery = "SELECT * FROM registration"; // query database to get all the logins
    // execute sql query
    db.query(sqlquery, (err, result) => { 
        if (err) {
        res.redirect('./'); 
    } 
    let newData = Object.assign({}, shopData, {availableLogins:result});
    console.log(newData)
    res.render("listeners.ejs", newData) 
    });
    });

    app.get('/addbook',function(req,res){ //to get the addbook page
        res.render('addbook.ejs', shopData);
    });
    app.post('/bookadded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
        return console.error(err.message);
        }
        else
        res.send(' This book is added to database, name: '+ req.body.name
        + ' price '+ req.body.price);
        });
        });

        

    app.get('/barginbooks',function(req,res){ //to get the bargin books page
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => { 
            if (err) {
            res.redirect('./'); 
        } 
        let newData = Object.assign({}, shopData, {availableBooks:result});
        console.log(newData)
        res.render("barginbooks.ejs", newData) 
        });
    });

        
}
