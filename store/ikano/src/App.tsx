import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import RoutingComponent from './components/Routing/Routing'
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.scss'


export default () => (
  < RoutingComponent />




  // <Layout>
  //     <Route exact path='/' component={Home} />
  //     <Route path='/counter' component={Counter} />

  //     <Route path='/fetch-data/:startDateIndex?' component={FetchData} />  
  //     <Route path ='/AplicantHome'  component = {AplicantHome} />  
  // </Layout>
);
