require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/sign-up.html")
});

app.post("/", async function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const url = `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`;

    try {
        const response = await axios.post(url, data, {
            auth: {
                username: "kenny1",
                password: process.env.MAILCHIMP_API_KEY
            }
        });

        if (response.status === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    } catch (error) {
        console.error("Mailchimp API Error:", error.response?.data || error.message);
        res.sendFile(__dirname + "/failure.html");
    }
});


app.post("/failure.html", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.")
});
