import React, { Component } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import styled from "styled-components";
import { inject } from "mobx-react";

const CardContainer = styled.div`
  margin-bottom: 20px;
`;

const CardTitle = styled.h1`
  margin: 8px 0;
  font-size: 24px;
`;

const CardCategory = styled.h1`
  margin: 7px 0;
  font-size: 16px;
  color: gray;
`;

const CardStatus = styled.h1`
  margin: 7px 0;
  font-size: 13px;
  color: #434ef0;
`;

@inject("documentsStore")
class Document extends Component {
  deleteDocument = () => {
    this.props.documentsStore.deleteDocument(this.props.id);
  };

  approveDocument = () => {
    this.props.documentsStore.approveDocument(this.props.id);
  };

  rejectDocument = () => {
    this.props.documentsStore.rejectDocument(this.props.id);
  };

  render() {
    const { title, description, category, status } = this.props;

    return (
      <CardContainer>
        <Card>
          <CardContent>
            <Grid justify="space-between" container>
              <Grid item>
                <CardTitle>{title}</CardTitle>
                <CardCategory>{category}</CardCategory>
              </Grid>
              <Grid item>
                <CardStatus>{status}</CardStatus>
              </Grid>
            </Grid>
            {description}
          </CardContent>
          <CardActions style={{ padding: "14px" }} disableSpacing>
            <Grid justify="flex-end" container>
              <Grid item>
                <IconButton onClick={this.approveDocument}>
                  <DoneIcon color="primary" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={this.rejectDocument}>
                  <ClearIcon color="secondary" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={this.deleteDocument}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </CardContainer>
    );
  }
}

export default Document;
