import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import Input from 'material-ui/Input/Input';
import { MenuItem } from 'material-ui/Menu';

function renderInput(inputProps) {
  const { classes, home, value, ref, ...other } = inputProps;

  return (
    <Input
      fullWidth
      className={classes.textField}
      value={value}
      inputProps={{
        'aria-label': 'Search for Package',
        'placeholder': 'Search for Package'
      }}
      { ...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion._source.package_name, query);
  const parts = parse(suggestion._source.package_name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        <img
          src={suggestion._source.owner_avatar}
          style={{
            height: '30px',
            marginRight: '10px',
            width: '30px',
            verticalAlign: 'middle'
          }}
          alt="search-result"
        />
        {parts.map((part, index) => {
          return part.highlight
            ? <span key={index} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            : <strong key={index} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>;
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper
      {...containerProps}
      square
      style={{ position: 'absolute', zIndex: '100' }}
    >
      {children}
    </Paper>
  );
}

const getSuggestionValue = suggestion => suggestion._source.package_name

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: '100%'
  },
  suggestionsContainerOpen: {
    position: 'fixed',
    width: '500px',
    margin: '10px auto',
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
    height: '100%',
    outline: 'none',
    border: 'none',
    background: 'none'
  },
});

class SearchPackages extends Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = async ({ value }) => {
    try {
      const inputValue = value.trim().toLowerCase();

      const endpoint = `${process.env.ELASTIC_SEARCH_ENDPOINT}/_search`;
      const body = {
        from : 0,
        size : 40,
        query: {
          query_string: {
            fields : ["package_name^2", "owner_name", "tags", "description", "language"],
            default_operator: 'AND',
            query: `${inputValue}*`
          },
        },
        sort: [
          {"stars" : {"order" : "desc", "unmapped_type" : "long"}}
       ]
      };

      const options = {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(body)
      };

      const response = await fetch(endpoint, options);
      const json = await response.json();

      const hits = json.hits.hits;
      if (hits.length) {
        this.setState({ suggestions: hits })
      } else {
        this.setState({ suggestions: [] })
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleSuggestionSelected = (event, response) => {
    const pkg = response.suggestion
    this.props._handlePackageSelection(pkg)
  }

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const { classes, id } = this.props;

    return (
      <div
        id={id}
        style={{ height: '100%' }}
      >
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          onSuggestionSelected={this.handleSuggestionSelected}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          focusInputOnSuggestionClick={false}
          inputProps={{
            autoFocus: false,
            classes,
            value: this.state.value,
            onChange: this.handleChange
          }}
        />
      </div>
    );
  }
}

SearchPackages.propTypes = {
  classes: PropTypes.object.isRequired,
};

SearchPackages.defaultProps = {
  id: 'SearchPackages'
}

export default withRouter(withStyles(styles)(SearchPackages));
