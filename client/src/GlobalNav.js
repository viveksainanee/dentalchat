import "./GlobalNav.css";
import { BsHouseFill, BsBellFill, BsGearFill } from "react-icons/bs";

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
        <BsHouseFill size="2em" />
        <BsGearFill size="2em" />
        <BsBellFill size="2em" />
      </div>
    </div>
  );
}

export default GlobalNav;
