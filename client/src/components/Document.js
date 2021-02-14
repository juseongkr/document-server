import React, { Component } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import styled from "styled-components";
import { inject } from "mobx-react";

const CardContainer = styled.div`
  margin-bottom: 20px;
`;

const CardTitle = styled.h1`
  margin: 8px 0;
  font-size: 22px;
`;

const CardCategory = styled.h1`
  margin: 7px 0;
  font-size: 18px;
  color: gray;
`;

@inject("documentsStore")
class Document extends Component {
  deleteDocument = () => {
    this.props.documentsStore.deleteDocument(this.props.id);
  };

  render() {
    const { title, description, category, status } = this.props;

    return (
      <CardContainer>
        <Card>
          <CardContent>
            <CardTitle>{title}</CardTitle>
            <CardCategory>{category}</CardCategory>
            {description}
          </CardContent>
          <CardActions style={{ padding: "14px" }} disableSpacing>
            <Grid justify="space-between" container>
              <Grid item style={{ color: "gray" }}>{status}</Grid>
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
