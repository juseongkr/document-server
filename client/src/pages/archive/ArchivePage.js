import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Fab, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import OutboxIcon from "@material-ui/icons/AllInbox";
import ArchiveIcon from "@material-ui/icons/Archive";
import SignOutIcon from "@material-ui/icons/ExitToApp";
import DescriptionIcon from "@material-ui/icons/Description";
import styled from "styled-components";
import Document from "../../components/Document";

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
  text-align: center;
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
class ArchivePage extends Component {
  componentDidMount() {
    this.props.documentsStore.fetchArchive();
  }

  handleSignOut = () => {
    const { userStore, documentsStore, routerStore } = this.props;
    userStore.signout();
    documentsStore.resetDocuments();
    routerStore.push("/signin");
  };

  renderDocuments = () => {
    const { documentsStore } = this.props;

    if (!documentsStore.archive.length) {
      return (
        <EmptyDocumentsPlaceholder>
          No documents available. Create one?
        </EmptyDocumentsPlaceholder>
      );
    }

    return documentsStore.archive.map((doc) => (
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
        <Title>Document System</Title>
        <DocumentsHeader>
          <CreateButtonContainer>
            <Fab
              variant="extended"
              style={{ margin: "10px" }}
              onClick={() => this.props.routerStore.push("/docs")}
            >
              <DescriptionIcon />
              All
            </Fab>
            <Fab
              variant="extended"
              onClick={() => this.props.routerStore.push("/docs/inbox")}
            >
              <InboxIcon />
              Inbox
            </Fab>
            <Fab
              variant="extended"
              style={{ margin: "10px" }}
              onClick={() => this.props.routerStore.push("/docs/outbox")}
            >
              <OutboxIcon />
              Outbox
            </Fab>
            <Fab
              variant="extended"
              onClick={() => this.props.routerStore.push("/docs/archive")}
            >
              <ArchiveIcon />
              Archive
            </Fab>
            <Fab
              variant="extended"
              style={{ margin: "10px" }}
              color="primary"
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
        <DocumentsContainer>{this.renderDocuments()}</DocumentsContainer>
      </DocumentsWrapper>
    );
  }
}

export default ArchivePage;
