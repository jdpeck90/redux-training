import React, { Component } from 'react'
import {Link} from 'react-router-dom';

 class Navbar extends Component {
  render() {
    return (
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
      <div class="container">
        <Link class="navbar-brand" to="/">DevConnector</Link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mobile-nav">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <Link class="nav-link" to="profiles.html"> Developers
              </Link>
            </li>
          </ul>

          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <Link class="nav-link" to="register.html">Sign Up</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="login.html">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    )
  }
}

export default Navbar;

