import React, { Component } from "react";
import { TextField, FormControl, Button } from "@material-ui/core";
import styled from "styled-components";
import { inject } from "mobx-react";
import ErrorMessage from "../../components/ErrorMessage";

const FormWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #edf4ff;
  padding: 30px;
  border-radius: 5px;
`;

@inject("documentsStore", "routerStore")
class CreateDocumentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      category: "",
      approvers: "",
      errorMessage: null,
    };
  }

  handleSubmitDocument = async () => {
    const { documentsStore, routerStore } = this.props;
    const { title, description, category, approvers } = this.state;

    try {
      await documentsStore.createDocument(
        title,
        description,
        category,
        approvers
      );
      routerStore.push("/docs");
    } catch (error) {
      const errorMessage = error.response.data.message;
      this.setState({ errorMessage });
    }
  };

  render() {
    return (
      <FormWrapper>
        <FormContainer>
          <h1>Create a new document</h1>
          <p>Provide information about the document you wish to approve.</p>

          {this.state.errorMessage && (
            <ErrorMessage message={this.state.errorMessage} />
          )}

          <FormControl fullWidth>
            <TextField
              label="Title"
              placeholder="Title"
              margin="normal"
              variant="outlined"
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Description"
              placeholder="Description"
              multiline
              rows="8"
              margin="normal"
              variant="outlined"
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Category"
              placeholder="Category"
              margin="normal"
              variant="outlined"
              onChange={(e) => this.setState({ category: e.target.value })}
            ></TextField>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Approvers"
              placeholder="user1@email.com, user2@email.com, user3@email.com"
              margin="normal"
              variant="outlined"
              onChange={(e) => this.setState({ approvers: e.target.value })}
            ></TextField>
          </FormControl>
          <Button
            style={{ marginTop: "10px" }}
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.handleSubmitDocument}
          >
            CREATE DOCUMENT
          </Button>
        </FormContainer>
      </FormWrapper>
    );
  }
}

export default CreateDocumentPage;
