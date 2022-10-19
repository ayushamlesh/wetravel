// creating simple http server
const express = require('express');
const app = express();
//for port that we are using
const port = process.env.PORT || 2022;
//for reading data from body to json
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
//for file system
const fs = require("fs");
//for chalk
const chalk = require("chalk");
app.set('view engine', 'ejs');
// using this middleware to serve static files
app.use(express.static('public'));
app.set('view engine', 'ejs');
// using this middleware to parse data from body to json
const uncodedparser = bodyParser.urlencoded({ extended: false });

//home route
app.get('/', (req, res) => {
    console.log(chalk.green("Home accessed"));
    res.render('home.ejs', { title: 'Home' });
});


//mountain route
app.get('/mountain', (req, res) => {
    console.log(chalk.blue("Mountain accessed"));
    res.render('mountain.ejs', { title: 'Mountain' });
});

app.get('/adventure', (req, res) => {
    console.log(chalk.bgGrey("Adventure accessed"));
    res.render('adventure.ejs', { title: 'Adventure' });
});

app.get('/beaches', (req, res) => {
    console.log(chalk.bgGreen.bold("Beaches accessed"));
    res.render('beaches.ejs', { title: 'Beaches' });
});

app.get('/pilgrimage', (req, res) => {
    console.log("Pilgrimage accessed");
    res.render('pilgrimage.ejs', { title: 'Pilgrimage' });
});
//booking page
app.get('/booking', (req, res) => {
    console.log(chalk.bgGreenBright("Booking accessed"));
    res.render('booking.ejs', { title: 'Booking' });
});

//posting data from booking page and getting in josn format
//for validating we write in [] below
app.post('/booking', uncodedparser, [
    check('no_travelar', "Cant be empty")
        .exists()
        .isLength({ min: 1 }),
    check('no_senior_citizen', "Cant be empty")
        .exists()
        .isLength({ min: 1 }),
    check('trip_days', "Cant be empty")
        .exists()
        .isLength({ min: 1 }),
    check('email', "Email is not valid")
        .isEmail()
        .normalizeEmail(),
    check('phone', "Phone number is not valid")
        .exists()
        .isLength({ min: 10, max: 10 })
],
    (req, res) => {

        /* creating a var to store error message and
         coming back to the registration page*/
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(chalk.bgRed(JSON.stringify(errors)));
            res.render('booking.ejs',
                { title: 'TRY AGAIN', error: `${JSON.stringify(errors)}` });
        }
        else {
            //storing the data that came from the body form
            const data = (req.body);
            // setting phone number as the file name
            const filename = data.email;
            // converting the data to string format and storing it in file
            fs.writeFileSync(filename + ".txt", JSON.stringify(data));
            console.log(chalk.bgYellowBright("Data stored"));
            res.render('home.ejs', { title: 'Sucessfull' });
        }
    });

//listening to the port
// calling the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});