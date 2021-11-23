import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from "react-router-dom"
import Checker from "./Checker";

ReactDOM.render(
  <BrowserRouter>
    <Checker />
  </BrowserRouter>,
  document.getElementById('root')
);