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
    this.player = {};
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
      m: false
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

    window.requestAnimationFrame(() =>
      setInterval(() => {
        this.move();
      }, 30)
    );
  }

  joinBattle() {
    if (this.avengername.current.value > 200) return;
    Meteor.call("block.party", this.avengername.current.value || "Anon");
  }

  render() {
    return (
      <React.Fragment>
        <ChatWindow>
          {this.props.avengers.length
            ? this.props.avengers.map(a => <Avenger key={a._id} avenger={a} />)
            : ""}
          <div>
            {!Avengers.findOne({ player: Meteor.userId() }) ? (
              <header style={{ zIndex: 1000000 }}>
                <button onClick={() => this.joinBattle()}>
                  Join the party
                </button>
                Your Name:{" "}
                <input
                  type="text"
                  ref={this.avengername}
                  placeholder="Enter a name..."
                  autoFocus
                />
              </header>
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
