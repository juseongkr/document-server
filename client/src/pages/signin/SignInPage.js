import React, { Component } from "react";
import styled from "styled-components";
import { Button, TextField } from "@material-ui/core";
import ErrorMessage from "../../components/ErrorMessage";
import { inject } from "mobx-react";

const Header = styled.div`
  margin-top: 0;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #edf4ff;
  padding: 30px;
  border-radius: 5px;
`;

const Field = styled(TextField)`
  width: 100%;
`;

@inject("userStore", "routerStore")
class SignInPage extends Component {
  render() {
    const { errorMsg } = this.state;

    return (
      <div className="fullscreen-wrapper">
        <FormContainer>
          <Header>Sign in</Header>
          {errorMsg && <ErrorMessage message={this.state.errorMsg} />}

          <div>
            <Field
              id="outlined-name"
              label="Username"
              margin="dense"
              variant="outlined"
              type="email"
              onChange={(event) =>
                this.setState({ username: event.target.value })
              }
            />
          </div>
          <div>
            <Field
              id="outlined-name"
              label="Password"
              margin="dense"
              variant="outlined"
              type="password"
              onChange={(event) =>
                this.setState({ password: event.target.value })
              }
            />
          </div>
          <hr />
          <div>
            <Button
              styled={{ marginBottom: "10px" }}
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.submit}
            >
              Sign In
            </Button>

            <Button fullWidth onClick={null}>
              Sign up now
            </Button>
          </div>
        </FormContainer>
      </div>
    );
  }
}

export default SignInPage;
