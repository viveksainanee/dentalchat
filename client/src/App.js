import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home";
import GlobalNav from "./GlobalNav";
import ChatRoom from "./ChatRoom";

/** App Component
 *
 *  Props: NONE
 *
 *  State: NONE
 *
 *  App -> { ChatRoom -> { useChat(roomId), Form }, Home }
 */
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <GlobalNav />
          <Home />
        </Route>
        <Route path="/:roomName">
          <GlobalNav />
          <ChatRoom />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
