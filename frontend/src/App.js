import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [subReddit, setSubReddit] = useState("dankmemes");
  const [channelId, setChannelId] = useState("1116857766305345557");
  const [count, setCount] = useState(19);
  const [frequency, setFrequency] = useState(5000);
  function sendRequest() {
    axios
      .post(`/test`, {
        withCredentials: true,
        data: {
          subReddit: subReddit,
          channelId: channelId,
          count: count,
          frequency: frequency,
        },
      })
      .then((res) => {
        console.log(res.data);
      });
  }
  useEffect(() => {
    if (channelId !== "") {
      console.log("you have selected: " + subReddit + " => " + channelId);
    }
  }, [subReddit, channelId]);
  return (
    <div className="App">
      <div id="outerDiv">
        <div>
          <span>enter sub reddit: </span>
          <input
            type="text"
            placeholder="enter sub reddit"
            value={subReddit}
            onChange={(e) => setSubReddit(e.target.value)}
          />
        </div>
        <div>
          <span>enter channel id: </span>
          <input
            type="text"
            placeholder="enter channel id"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          />
        </div>
        <div>
          <span>enter count #: </span>
          <input
            type="text"
            placeholder="enter channel id"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <div>
          <span>enter frequency: </span>
          <input
            type="text"
            placeholder="enter channel id"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>
        <button onClick={sendRequest} class="btn">
          send
        </button>
      </div>
    </div>
  );
}

export default App;
