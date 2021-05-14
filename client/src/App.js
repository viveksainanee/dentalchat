import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./Home";
import ChatRoom from "./ChatRoom";
// import ReactDOM from 'react-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  faPaperPlane,
  faThumbsUp,
  faCommentDots,
  faEdit
} from '@fortawesome/free-solid-svg-icons'

library.add(fab, faPaperPlane, faThumbsUp, faCommentDots, faEdit);

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
          <Home />
        </Route>
        <Route path="/:roomName">
          <ChatRoom />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
