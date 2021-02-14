import React, { Component } from "react";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components";
import { inject } from "mobx-react";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

const FiltersContainer = styled.div`
  margin-top: 20px;
`;

const ControlContainer = styled.div`
  background-color: #c0cde0;
  border-radius: 5px;
  padding: 10px;
`;

@inject("documentsStore")
class DocumentsFilters extends Component {
  filters$ = new Subject();
  constructor(props) {
    super(props);
    this.state = {
      status: props.documentsStore.filters.status,
      search: props.documentsStore.filters.search,
      category: props.documentsStore.filters.category,
    };

    this.filters$.pipe(debounceTime(500)).subscribe((filters) => {
      props.documentsStore.updateFilters(filters);
    });
  }

  syncFilters = () => {
    const { status, search, category } = this.state;
    this.filters$.next({ status, search, category });
  };

  handleStatusFilterChange = (e) => {
    const status = e.target.value;
    this.setState({ status }, this.syncFilters);
  };

  handleSearchTermChange = (e) => {
    const search = e.target.value;
    this.setState({ search }, this.syncFilters);
  };

  handleCategoryChange = (e) => {
    const category = e.target.value;
    this.setState({ category }, this.syncFilters);
  };

  render() {
    return (
      <FiltersContainer>
        <Grid justify="space-between" container>
          <Grid item>
            <ControlContainer>
              <FormControl style={{ width: "230px" }}>
                <TextField
                  placeholder="Search..."
                  value={this.state.search}
                  onChange={this.handleSearchTermChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </ControlContainer>
          </Grid>
          <Grid item>
            <ControlContainer>
              <FormControl style={{ width: "230px" }}>
                <TextField
                  placeholder="Category..."
                  value={this.state.category}
                  onChange={this.handleCategoryChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </ControlContainer>
          </Grid>
          <Grid item>
            <ControlContainer>
              <FormControl style={{ width: "230px" }}>
                <Select
                  value={this.state.status}
                  onChange={this.handleStatusFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">No status filter</MenuItem>
                  <MenuItem value={"IN_PROGRESS"}>In Progress</MenuItem>
                  <MenuItem value={"APPROVED"}>Approved</MenuItem>
                  <MenuItem value={"REJECTED"}>Rejected</MenuItem>
                </Select>
              </FormControl>
            </ControlContainer>
          </Grid>
        </Grid>
      </FiltersContainer>
    );
  }
}

export default DocumentsFilters;
