import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("hello world");
  const [sentMessage, setSentMessage] = useState([]);
  const [subReddit, setSubReddit] = useState("dankmemes");
  const [channelId, setChannelId] = useState("832058298705772587");
  const [count, setCount] = useState(19);
  const [frequency, setFrequency] = useState(5000);
  const [isToggled, setIsToggled] = useState(false);
  const [deleteTimeout, setDeleteTimeout] = useState(5000);

  const handleToggle = () => {
    setIsToggled((prevIsToggled) => !prevIsToggled);
  };

  function testMessage() {
    // axios
    //   .post(`http://localhost:5000/testing`, {
    //     withCredentials: true,
    //     data: {
    //       message: message,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //   });

    //small change
    axios
      .post(`http://localhost:5000/send`, {
        withCredentials: true,
        data: {
          message: message,
          channelId: channelId,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.message && !isToggled) {
          console.log(res.data.id);
          setSentMessage((prevstate) => [res.data, ...prevstate]);
        } else {
          console.log("auto delete enabled");
          setTimeout(() => {
            handleDelete(res.data.id);
          }, deleteTimeout);
        }
      });
  }

  function sendRequest() {
    axios
      .post(`http://localhost:5000/sendMemes`, {
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

  function handleDelete(id) {
    axios
      .post(`http://localhost:5000/delete`, {
        withCredentials: true,
        data: {
          channelId: channelId,
          messageId: id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.message) {
          console.log(res.data.messageId);
          setSentMessage((prevstate) =>
            prevstate.filter((message) => message.id !== res.data.messageId)
          );
        }
      });
  }
  function sendMessage() {
    axios
      .post(`http://localhost:5000/send`, {
        withCredentials: true,
        data: {
          message: message,
          channelId: channelId,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.message && !isToggled) {
          console.log(res.data.id);
          setSentMessage((prevstate) => [res.data, ...prevstate]);
        } else {
          console.log("auto delete enabled");
          setTimeout(() => {
            handleDelete(res.data.id);
          }, deleteTimeout);
        }
      });
  }
  const deleteMessage = (id) => {
    console.log("deleting message: " + id);
    handleDelete(id);
  };
  useEffect(() => {
    if (channelId !== "") {
      console.log("you have selected: " + subReddit + " => " + channelId);
    }
  }, [subReddit, channelId]);
  return (
    <div className="App">
      <div className="outerDiv">
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
        <button
          onClick={() => {
            sendRequest();
          }}
          class="btn"
        >
          send
        </button>
      </div>
      <div className="divider"></div>
      <div className="outerDiv">
        <div>
          <span>enter message: </span>
          <input
            type="text"
            placeholder="enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

        <button
          onClick={() => {
            sendMessage();
          }}
          class="btn"
        >
          send
        </button>
        <div>
          <label>
            Auto Delete:
            <input
              type="checkbox"
              checked={isToggled}
              onChange={() => handleToggle()}
            />
          </label>
          {isToggled ? (
            <div>
              <span>enter timeout: </span>
              <input
                type="text"
                placeholder="enter channel id"
                value={deleteTimeout}
                onChange={(e) => setDeleteTimeout(e.target.value)}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div>
          {sentMessage.length > 0 &&
            sentMessage.map((message) => (
              <div className="message-sent">
                <div>
                  {message.message}:{message.id}
                </div>
                <button onClick={() => deleteMessage(message.id)}>
                  delete
                </button>
              </div>
            ))}
        </div>
        <br />
        <div>
          <label>
            Batch send:
            <input
              type="checkbox"
              checked={isToggled}
              onChange={() => handleToggle()}
            />
          </label>
          {isToggled ? (
            <div>
              <span>enter timeout: </span>
              <input
                type="text"
                placeholder="enter channel id"
                value={deleteTimeout}
                onChange={(e) => setDeleteTimeout(e.target.value)}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div className="divider"></div>
      <div>
        <button
          onClick={() => {
            testMessage();
          }}
        >
          test
        </button>
      </div>
    </div>
  );
}

export default App;
