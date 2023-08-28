const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 5000;
const COOKIE = process.env.COOKIE;
const AUTHORIZATION = process.env.AUTHORIZATION;
app.use(cors());
app.use(express.json());

//resolve path for front end
app.use(express.static(path.resolve(__dirname, "../frontend/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const axios = require("axios");

function getMemes(subReddit) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:4000/memes?subReddit=${encodeURIComponent(
      subReddit
    )}`, // Use query parameter
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: { subReddit: subReddit },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error; // Re-throw the error to propagate it up if needed.
    });
}

function sendMessage(dataSent, memes) {
  var axios = require("axios");
  const amount = 3;
  let count = 0;
  const intervalTime = 3000;
  let sendMeme = memes;

  const interval = setInterval(function () {
    if (count < amount) {
      const randomNumber = Math.floor(Math.random() * 9e17) + 1e17;
      console.log(sendMeme.memes[count].url);

      var FormData = require("form-data");
      var data = new FormData();
      data.append("content", sendMeme.memes[count].url);
      data.append("flags", "0");
      data.append("nonce", `9${randomNumber}`);
      data.append("tts", "false");

      var config = {
        method: "post",
        url: `https://discord.com/api/v9/channels/${dataSent.channelId}/messages`,
        headers: {
          Cookie: COOKIE,
          authorization: AUTHORIZATION,

          ...data.getHeaders(),
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log("successfuly retrieved reddit subReddit posts");
        })
        .catch(function (error) {
          console.log(error);
        });
      count++;
    } else {
      clearInterval(interval); // Stop the interval when count reaches 10
    }
  }, intervalTime);
}

app.post("/test", async (req, res) => {
  res.send("sending message");
  console.log("subReddit: " + req.body.data.subReddit);
  console.log("channelId: " + req.body.data.channelId);

  try {
    const memes = await getMemes(req.body.data.subReddit);
    // Assuming sendMessage is an asynchronous function, you can await it here.
    await sendMessage(req.body.data, memes);
  } catch (error) {
    // Handle any errors that occurred during the execution.
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
