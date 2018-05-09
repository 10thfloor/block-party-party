import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import styled from "styled-components";

const ChatWindow = styled.div`
  width: 100vw;
  height: 100vh;
  background: skyblue;
  color: white;
  position: relative;
  font-size: 2rem;

  .wtf {
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 10000;
  }

  .help {
    position: absolute;
    bottom: 0;
    left: 2rem;
  }

  .help span {
    color: royalblue;
  }

  header {
    position: fixed;
    z-index: 1000000;
    background-image: linear-gradient(90deg, transparent, skyblue);
  }

  header p {
    margin: 0;
    padding-left: 1rem;
  }

  input {
    font-size: 2rem;
    margin: 1rem;
    padding: 0.5rem;
  }
  button {
    background: red;
    color: white;
    padding: 1rem;
    margin: 1rem;
    border: none;
    font-size: 2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }

  button:hover {
    cursor: pointer;
    color: red;
    background: white;
  }
`;

const AvengerComponent = styled.div.attrs({
  style: ({ x, y, bg }) => ({
    transform: `translateX(${x}px) translateY(${y}px)`,
    background: `${bg}`
  })
})`
  position: absolute;
  padding: 2rem;
  background: red;
  color: white;
  h1 {
    margin: 0;
    padding: 0;
  }
  input {
    font-size: 2rem;
    padding: 0.5rem;
  }
`;

const AvengerMessage = styled.div`
  position: relative;
  background: white;
  color: red;
  font-weight: bold;
  padding: 2rem;
  margin-top: 1rem;
  font-size: 4rem;
  input {
    font-size: 2rem;
    padding: 0.5rem;
  }
`;

class Avenger extends Component {
  constructor() {
    super();
    this.chatMessage = React.createRef();
  }

  sendMessage(e) {
    if (!this.chatMessage.current.value) return;
    if (e.key === "Enter") {
      Meteor.call("show.message", {
        player: Meteor.userId(),
        showMessage: false
      });
      Meteor.call("chat.message", {
        player: Meteor.userId(),
        message: this.chatMessage.current.value
      });
      setTimeout(() => {
        Meteor.call("chat.message", {
          player: Meteor.userId(),
          message: ""
        });
      }, 2000);
    }
  }

  render() {
    return this.props.avenger ? (
      <AvengerComponent
        y={this.props.avenger.y}
        x={this.props.avenger.x}
        bg={this.props.avenger.bg}
      >
        <h1>{this.props.avenger.name}</h1>
        {this.props.avenger.message ? (
          <AvengerMessage>{this.props.avenger.message}</AvengerMessage>
        ) : (
          ""
        )}
        {this.props.avenger.showMessage &&
        this.props.avenger.player === Meteor.userId() ? (
          <input
            type="text"
            ref={this.chatMessage}
            onKeyPress={e => this.sendMessage(e)}
            placeholder="Type a message..."
            autoFocus
          />
        ) : (
          ""
        )}
      </AvengerComponent>
    ) : (
      ""
    );
  }
}

const AvengerData = withTracker(({ name }) => {
  const avenger = Avengers.find({ name }).fetch();
  return {
    avenger: avenger[0]
  };
})(Avenger);

class HelloWorld extends Component {
  constructor() {
    super();
    this.avengername = React.createRef();
    this.player = {};
    this.state = {
      help: false
    };
  }

  move() {
    if ("ArrowUp" in this.player) Meteor.call("move.up", Meteor.userId());
    if ("ArrowDown" in this.player) Meteor.call("move.down", Meteor.userId());
    if ("ArrowRight" in this.player) Meteor.call("move.right", Meteor.userId());
    if ("ArrowLeft" in this.player) Meteor.call("move.left", Meteor.userId());
  }

  componentDidMount() {
    window.onkeydown = e => {
      this.player[e.key] = true;
      switch (e.key) {
        case "`":
          Meteor.call("show.message", {
            player: Meteor.userId(),
            showMessage: !Avengers.findOne({ player: Meteor.userId() })
              .showMessage
          });
          break;
        case "-":
          Meteor.call("remove.avenger", Meteor.userId());
          break;
      }
    };
    window.onkeyup = e => {
      delete this.player[e.key];
    };

    setInterval(() => {
      window.requestAnimationFrame(this.move.bind(this));
    }, 30);
  }

  joinBattle() {
    if (this.avengername.current.value > 200) return;
    Meteor.call("block.party", this.avengername.current.value || "🌮");
  }

  toggleHelp() {
    this.setState({ help: !this.state.help });
  }

  render() {
    return (
      <React.Fragment>
        <ChatWindow>
          <a
            href=""
            className="wtf"
            onClick={e => {
              e.preventDefault();
              this.toggleHelp();
            }}
          >
            {!this.state.help ? "wtf?" : "OK!"}
          </a>
          {this.props.avengers.length
            ? this.props.avengers.map(a => <Avenger key={a._id} avenger={a} />)
            : ""}
          <div>
            {!Avengers.findOne({ player: Meteor.userId() }) ? (
              <header>
                <button onClick={() => this.joinBattle()}>
                  Join the party
                </button>
                Your Name:{" "}
                <input
                  type="text"
                  ref={this.avengername}
                  placeholder="Enter a name..."
                  onKeyDown={e => {
                    console.log(e.key);
                    if (e.key === "Enter") {
                      this.joinBattle();
                    }
                  }}
                  autoFocus
                />
              </header>
            ) : (
              ""
            )}
            {this.state.help ? (
              <p className="help">
                <span>Move: </span> Arrows <span>Write a message: </span> "`"
                (Back-tick key) <span>Send message: </span> "Enter"{" "}
                <span>Leave party: </span> "-"
              </p>
            ) : (
              ""
            )}
          </div>
        </ChatWindow>
      </React.Fragment>
    );
  }
}

const ChatAppContainer = withTracker(() => {
  const avengers = Avengers.find().fetch();
  return {
    avengers
  };
})(HelloWorld);

Meteor.startup(() => {
  render(<ChatAppContainer />, document.getElementById("app"));
});
