const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

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

function sendBatchMessage(dataSent, memes) {
  var axios = require("axios");
  const amount = dataSent.count;
  let count = 0;
  const intervalTime = dataSent.frequency;
  let sendMeme = memes;

  const interval = setInterval(function () {
    if (count < amount) {
      const randomNumber = Math.floor(Math.random() * 9e17) + 1e17;

      console.log("TITLE: " + sendMeme.memes[count].title);
      console.log("URL: " + sendMeme.memes[count].url);
      console.log("random number: " + randomNumber);

      var FormData = require("form-data");
      var data = new FormData();
      data.append(
        "content",
        `${sendMeme.memes[count].title} \n ${sendMeme.memes[count].url}`
      );
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

app.post("/sendMemes", async (req, res) => {
  res.send("sending message");
  console.log("subReddit: " + req.body.data.subReddit);
  console.log("channelId: " + req.body.data.channelId);
  console.log("count: " + req.body.data.count);

  try {
    const memes = await getMemes(req.body.data.subReddit);
    // Assuming sendMessage is an asynchronous function, you can await it here.
    await sendBatchMessage(req.body.data, memes);
  } catch (error) {
    // Handle any errors that occurred during the execution.
    console.error(error);
  }
});

app.post("/send", async (req, res) => {
  // try {
  //   const config = {
  //     method: "get",
  //     url: "http://localhost:4000/memes",
  //   };

  //   const response = await axios(config); // Wait for the axios request to complete

  //   console.log("Request made");
  //   console.log(response.data);

  //   res.status(200).json(response.data);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: error.message });
  // }

  console.log("message: " + req.body.data.message);
  console.log("channelId: " + req.body.data.channelId);
  const randomNumber = Math.floor(Math.random() * 9e17) + 1e17;
  console.log("random number: " + randomNumber);
  var FormData = require("form-data");
  var data = new FormData();
  data.append("content", req.body.data.message);
  data.append("flags", "0");
  data.append("nonce", randomNumber);
  data.append("tts", "false");
  var config = {
    method: "post",
    url: `https://discord.com/api/v9/channels/${req.body.data.channelId}/messages`,
    headers: {
      Cookie: COOKIE,
      authorization: AUTHORIZATION,
      ...data.getHeaders(),
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      console.log("successfuly sent message");
      console.log(response.data.id);
      res
        .status(200)
        .json({ message: req.body.data.message, id: response.data.id });
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

app.post("/delete", (req, res) => {
  console.log("id: " + req.body.data.messageId);
  console.log("channelId: " + req.body.data.channelId);
  const axios = require("axios");

  const url = `https://discord.com/api/v9/channels/${req.body.data.channelId}/messages/${req.body.data.messageId}`;

  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      Authorization: AUTHORIZATION,
      Cookie: COOKIE,
    },
  };

  axios
    .request(config)
    .then((response) => {
      res.json({
        message: "successfuly deleted message",
        messageId: req.body.data.messageId,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });

  // var config = {
  //   method: "delete",
  //   url: `https://discord.com/api/v9/channels/${req.body.data.channelId}/messages/${req.body.data.id}`,
  //   headers: {
  //     Cookie: COOKIE,
  //     authorization: AUTHORIZATION,
  //   },
  // };

  // axios(config)
  //   .then(function (response) {
  //     console.log("successfuly deleted message");
  //     console.log(response.data.id);
  //     res.status(200).json({ message: "successfuly deleted message" });
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //     res.status(500).json({ error: error });
  //   });
});

app.post("/testing", (req, res) => {
  res.send(req.body.data.message);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
