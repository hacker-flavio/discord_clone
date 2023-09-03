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

app.post("/test", async (req, res) => {
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

app.post("/send", (req, res) => {
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
      Authorization:
        "NzY5Nzc3NDg4MjcxNjM4NTQ5.Gu1WFU.YxX7i3cbU45Jh5oiyEbIK6_yrSoea03ppx1f78",
      Cookie:
        "__dcfduid=3f133c20462a11eeb0adc19a86fbd684; __sdcfduid=3f133c21462a11eeb0adc19a86fbd68480b730b19ea6cafe3a082cce475c7a82009d79c5598df7bcccd3f757a9c46e13; _gcl_au=1.1.355775653.1693285884; _ga=GA1.1.1409257420.1693285884; __cfruid=a97a62d26c33dda771a2a89b218e2d164ee51cc2-1693697974; _cfuvid=6FtEsEi09ALpDb_FfCQDGcCCrxcLcfb.3Gph8x3queg-1693697974959-0-604800000; locale=en-US; OptanonConsent=isIABGlobal=false&datestamp=Sat+Sep+02+2023+16%3A39%3A35+GMT-0700+(Pacific+Daylight+Time)&version=6.33.0&hosts=&landingPath=https%3A%2F%2Fdiscord.com%2F&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1; _ga_Q149DFWHT7=GS1.1.1693697975.2.0.1693697978.0.0.0; cf_clearance=ZZLWEzfQwM855UleVabZ2wB7fXwS5UGjCMZjixOtg3M-1693697983-0-1-b6b11789.8fdc4598.d0877456-0.2.1693697983; __cfruid=05225543dd626d355c53fef498ff9c8976ee149e-1693701214; _cfuvid=Pwp5C8GySA.YbkIpIwXxDVczmH7Ji7sg6nXFEcod.5M-1693701214210-0-604800000",
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
