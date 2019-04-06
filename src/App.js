import React, { Component } from 'react';
import AppNavBar from "./Components/AppNavBar";
import AppJumboTron from "./Components/AppJumboTron";
import AppLoginForm from "./Components/AppLoginForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <AppNavBar/>
          <AppLoginForm/>
          <AppJumboTron/>
        </header>
      </div>
    );
  }
}

export default App;
