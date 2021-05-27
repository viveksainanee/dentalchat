import { Link } from "react-router-dom";
import "./GlobalNav.css";

/** GlobalNav Component
 *
 *  Props: NONE
 *
 *  State: None
 *
 *  App -> GlobalNav
 */

function GlobalNav() {
  return (
    <div className="GlobalNav-container">
      <div className="GlobalNav-div col-10 mx-auto align-self-center">
        <Link to={"/"}>Home</Link>
      </div>
    </div>
  );
}

export default GlobalNav;
