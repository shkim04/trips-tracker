import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import CreateTrip from "./components/create-trip";
import ShowTrip from "./components/show-trip";

function App() {
  return (
    <Router>
      <Route path="/" exact component={ShowTrip} />
      <Route path="/create" component={CreateTrip} />
    </Router>
  );
}

export default App;

