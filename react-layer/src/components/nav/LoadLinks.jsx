import React from "react";
import { NavLink } from "react-router-dom";


function LoadLinks({links}) {
    return (
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
                links.map(link =>
                {
                    return(
                        <li key = {link.name} className="nav-item">
                            <NavLink className="nav-link text-decoration-none" style = {({ isActive }) => 
                                    isActive ? {color: "black"} : undefined
                                }  activeclassname = "page" to={link.route}>
                                {link.name}
                            </NavLink>
                        </li>
                    );
                }
            )}
        </ul>
    );
}
export default LoadLinks;