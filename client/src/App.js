import React, { Component, Fragment } from "react";
import { Route } from "react-router";
import { inject, observer } from "mobx-react";

import SignInPage from "./pages/signin/SignInPage";
import SignUpPage from "./pages/signup/SignUpPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import CreateDocumentPage from "./pages/create-document/CreateDocumentPage";

@inject("routerStore")
@observer
class App extends Component {
  render() {
    return (
      <Fragment>
        <Route exact path="/" component={SignInPage} />
        <Route path="/signin/" component={SignInPage} />
        <Route path="/signup/" component={SignUpPage} />
        <Route exact path="/docs" component={DocumentsPage} />
        <Route exact path="/docs/create" component={CreateDocumentPage} />
      </Fragment>
    );
  }
}

export default App;
