const express = require("express");
const path = require("path");
const { google } = require("googleapis");
const cors = require('cors');


const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/submit", async (req, res) => {
    const { name, age } = req.body;

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        const spreadsheetsID = "1FWBm-_3zrQplvDwfrWqvR9p7v2RO55LRbE23zT_EE1s";

        // Append the data to the Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetsID,
            range: 'Sheet1', // Adjust this to your sheet's name or specific range
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[name, age]] // Assuming first column is name and second is age
            }
        });

        res.json({ message: "Data added to Google Sheets", name, age });

    } catch (error) {
        console.error("Error updating Google Sheets:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/fetchData", async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        const spreadsheetsID = "1FWBm-_3zrQplvDwfrWqvR9p7v2RO55LRbE23zT_EE1s";

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetsID,
            range: 'Sheet1',
        });

        res.json(response.data);

    } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3000, () => console.log("running on 3000"));
