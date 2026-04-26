const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const tournaments = require('./data/tournaments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your_email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_app_password'
    }
});

// Routes
app.get('/', (req, res) => {
    const states = Object.keys(tournaments);
    res.render('index', { states });
});

app.get('/tournaments/:state', (req, res) => {
    const state = req.params.state;
    if (tournaments[state]) {
        const sports = Object.keys(tournaments[state]);
        res.render('tournaments', { state, sports, tournaments: tournaments[state] });
    } else {
        res.redirect('/');
    }
});

app.get('/register/:state/:sport/:tournamentId', (req, res) => {
    const { state, sport, tournamentId } = req.params;
    const tournament = tournaments[state]?.[sport]?.find(t => t.id == tournamentId);
    
    if (tournament) {
        res.render('register', { 
            tournament, 
            state, 
            sport,
            tournamentId 
        });
    } else {
        res.redirect('/');
    }
});

app.post('/submit-registration', async (req, res) => {
    const {
        teamName,
        captainName,
        email,
        phone,
        players,
        state,
        sport,
        tournamentName,
        tournamentDate,
        contactEmail,
        registrationFee
    } = req.body;

    // Prepare email content for organizer
    const organizerEmailContent = `
        New Registration Received!
        
        Tournament: ${tournamentName}
        State: ${state}
        Sport: ${sport}
        Tournament Date: ${tournamentDate}
        
        Team Details:
        Team Name: ${teamName}
        Captain: ${captainName}
        Email: ${email}
        Phone: ${phone}
        Number of Players: ${players}
        
        Registration Fee: ${registrationFee}
        
        Please contact the team for further communication.
    `;

    // Email confirmation for team
    const teamEmailContent = `
        Dear ${captainName},
        
        Your team "${teamName}" has been successfully registered for ${tournamentName}!
        
        Tournament Details:
        - Sport: ${sport}
        - State: ${state}
        - Date: ${tournamentDate}
        - Registration Fee: ${registrationFee}
        
        We will contact you soon with further details.
        
        For any queries, contact: ${contactEmail}
        
        Best regards,
        Sports Tournament Committee
    `;

    try {
        // Send email to tournament organizer
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: contactEmail,
            subject: `New Registration: ${teamName} for ${tournamentName}`,
            text: organizerEmailContent
        });

        // Send confirmation email to team
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Registration Confirmation: ${tournamentName}`,
            text: teamEmailContent
        });

        res.send(`
            <html>
                <head>
                    <title>Registration Successful</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        }
                        .success-box {
                            background: white;
                            padding: 40px;
                            border-radius: 10px;
                            max-width: 500px;
                            margin: auto;
                            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                        }
                        h1 { color: #27ae60; }
                        a {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            background: #3498db;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="success-box">
                        <h1>✓ Registration Successful!</h1>
                        <p>Your team ${teamName} has been registered for ${tournamentName}.</p>
                        <p>A confirmation email has been sent to ${email}</p>
                        <a href="/">Register for More Tournaments</a>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Email error:', error);
        res.send(`
            <html>
                <head>
                    <title>Registration Error</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        }
                        .error-box {
                            background: white;
                            padding: 40px;
                            border-radius: 10px;
                            max-width: 500px;
                            margin: auto;
                            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                        }
                        h1 { color: #e74c3c; }
                        a {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            background: #3498db;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="error-box">
                        <h1>❌ Registration Error</h1>
                        <p>There was an error processing your registration.</p>
                        <p>Please try again or contact support.</p>
                        <a href="/">Try Again</a>
                    </div>
                </body>
            </html>
        `);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sports Tournament Server running on port ${PORT}`);
});
