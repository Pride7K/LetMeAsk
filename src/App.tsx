import React from "react";
import { Home } from "./pages/Home/index";
import { NewRoom } from "./pages/NewRoom/index";
import { Room } from "./pages/Room/index";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
