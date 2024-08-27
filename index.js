/* =====> Import required packages */
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import https from "https";
import helmet from "helmet";
import {artObjArray} from "./data/data.js"

/* =====> Create an express app and set the port number */
const app = express();
const port = 3000;
const artUrl = "https://www.rijksmuseum.nl/api/en/collection";

/* =====> Use the public folder for static files */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/* =====> Use Helemt to help secure Express app by setting HTTP response headers */
app.use(helmet());

/* =====> Set the API Key and disable SSL agent by https */
const rjAPIKey = "mqq3MJVx";
const agent = new https.Agent({  
    rejectUnauthorized: false
});

/* =====> Request the collection from Public API and set as render parameters */
app.get("/", async (req, res) => {

    try {
        /* =====> Get all collectoins under type=drawing */
        // const resp = await axios.get(artUrl, {
        //     params: {
        //         key: rjAPIKey,
        //         type: "painting",
        //     },
        //     httpsAgent: agent
        // });
        // const artObjNum = resp.data.count;
        const artObjNum = 4850;

        /* =====> Use for loop to get all collections */
        // let artObjJSON;
        // Math.floor(artObjNum/100)

        // for (var i=1; i<=Math.ceil(artObjNum/100); i++) {
        //     const resp = await axios.get(artUrl, {
        //         params: {
        //             key: rjAPIKey,
        //             type: "painting",
        //             p: `${i}`,
        //             ps: "100",
        //         },
        //         httpsAgent: agent
        //     });

        //     if (i === 1) {
        //         var artObjJSON = resp.data.artObjects;
        //     } else {
        //         var artObjJSON = artObjJSON.concat(resp.data.artObjects);
        //     }
        //     console.log(`Loop Number: ${i}`);
        // };

        // let objNumArray = artObjJSON.map(function (item, index) {
        //     return item.objectNumber;
        // });
        // console.log(objNumArray);
        // console.log(artObjArray);

        const randNum = Math.floor(Math.random() * artObjNum) + 1;
        // const colId = artObjJSON[randNum].objectNumber;
        // const colId = resp.data.artObjects[0].objectNumber;

        const colId = artObjArray[randNum];
        // const colId = "SK-A-5117";
        // const colId = "SK-A-4276";
        // const colId = "SK-A-964";
        // const colId = "SK-A-611";
        // const colId = "SK-A-655";
        console.log(colId);

        /* =====> Get the collection from the random objects */
        // const colId = "SK-A-2344";
        const response = await axios.get(artUrl + "/" + colId, {
            params: {
                key: rjAPIKey,
            },
            httpsAgent: agent
        });
        const result = response.data;
        const colObj = result.artObject;
        // console.log(result);
        // console.log(colObj.objectNumber);

        
        let objDesc = colObj.plaqueDescriptionEnglish;
        let objLabelDesc = colObj.label.description;
        // console.log(objDesc);
        if (objDesc === null && objLabelDesc === null) {
            objDesc = "Description in NL: " + colObj.description;
        } else if (objDesc === null && objLabelDesc != null) {
            objDesc = objLabelDesc ;
        }
        
        try {
            var objImgUrl = colObj.webImage.url;
        } catch (error) {
            var objImgUrl = "./public/images/whisper-img.jpg";
        }
        console.log(objImgUrl);


        res.render("index.ejs", 
            {
                // rjColTitle: "The Milkmaid, Johannes Vermeer, ca. 1660",
                // rjColImgUrl: "https://lh3.googleusercontent.com/cRtF3WdYfRQEraAcQz8dWDJOq3XsRX-h244rOw6zwkHtxy7NHjJOany7u4I2EG_uMAfNwBLHkFyLMENzpmfBTSYXIH_F=s0",
                // rjColUrl: "https://www.rijksmuseum.nl/en/collection/SK-A-2344",
                rjColTitle: colObj.longTitle,
                rjColImgUrl: objImgUrl,
                rjColDesc: objDesc,
                rjColUrl: "https://www.rijksmuseum.nl/en/collection/" + colId,
                // testOut: objNumArray,
                
            });

    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", { error: error.message });
    }
});

/* =====> Listen on your predefined port and start the server */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});