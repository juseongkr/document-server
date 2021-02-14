import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Fab, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import OutboxIcon from "@material-ui/icons/AllInbox";
import SignOutIcon from "@material-ui/icons/ExitToApp";
import styled from "styled-components";
import Document from "../../components/Document";
import DocumentsFilters from "../../components/DocumentsFilters";

const DocumentsWrapper = styled.div`
  width: 100%;
  max-width: 860px;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
`;

const DocumentsHeader = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 3px solid #757c87;
`;

const Title = styled.h1`
  width: 100%;
  color: #edf4ff;
`;

const CreateButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const DocumentsContainer = styled.div`
  padding-top: 20px;
`;

const EmptyDocumentsPlaceholder = styled.p`
  color: #edf4ff;
  text-align: center;
  font-size: 22px;
`;

const SignOutIconContainer = styled.div`
  margin-left: 10px;

  .signOutIcon {
    fill: #edf4ff;
  }
`;

@inject("documentsStore", "routerStore", "userStore")
@observer
class DocumentsPage extends Component {
  componentDidMount() {
    this.props.documentsStore.fetchDocuments();
  }

  handleSignOut = () => {
    const { userStore, documentsStore, routerStore } = this.props;
    userStore.signout();
    documentsStore.resetDocuments();
    routerStore.push("/signin");
  };

  renderDocuments = () => {
    const { documentsStore } = this.props;

    if (!documentsStore.documents.length) {
      return (
        <EmptyDocumentsPlaceholder>
          No documents available. Create one?
        </EmptyDocumentsPlaceholder>
      );
    }

    return documentsStore.documents.map((doc) => (
      <Document
        key={doc.id}
        id={doc.id}
        title={doc.title}
        description={doc.description}
        status={doc.status}
        category={doc.category}
      />
    ));
  };

  render() {
    return (
      <DocumentsWrapper>
        <DocumentsHeader>
          <Title>Document System</Title>
          <CreateButtonContainer>
            <Fab
              variant="extended"
              onClick={() => this.props.routerStore.push("/inbox")}
            >
              <InboxIcon />
              Inbox
            </Fab>
            <Fab
              variant="extended"
              style={{ margin: "10px" }}
              onClick={() => this.props.routerStore.push("/outbox")}
            >
              <OutboxIcon />
              Outbox
            </Fab>
            <Fab
              variant="extended"
              onClick={() => this.props.routerStore.push("/docs/create")}
            >
              <AddIcon />
              Create
            </Fab>
            <SignOutIconContainer>
              <IconButton onClick={this.handleSignOut}>
                <SignOutIcon className="signOutIcon" />
              </IconButton>
            </SignOutIconContainer>
          </CreateButtonContainer>
        </DocumentsHeader>

        <DocumentsFilters />

        <DocumentsContainer>{this.renderDocuments()}</DocumentsContainer>
      </DocumentsWrapper>
    );
  }
}

export default DocumentsPage;
