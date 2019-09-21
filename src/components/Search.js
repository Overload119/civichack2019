import React from 'react';
import Autocomplete from 'react-autocomplete';
import fuzzysearch from 'fuzzysearch';
import numeral from 'numeral';

type Props = {
  values: Array<Object>
};
type State = {
  query: string
};
export default class Search extends React.Component<Props> {
  state: State = {
    query: ''
  };
  render() {
    return (
      <Autocomplete
        inputProps={{
          className: 'input'
        }}
        getItemValue={item => item.FID.toString()}
        shouldItemRender={(item, value) => {
          if (this.state.query.length <= 1 || value == null) {
            return false;
          }
          return fuzzysearch(value.toLowerCase(), item.UNINAME.toLowerCase());
        }}
        items={this.props.values || []}
        renderItem={(item, isHighlighted) => (
          <div
            key={item.FID}
            style={{ background: isHighlighted ? 'lightgray' : 'white' }}
          >
            {item.UNINAME}
            <br />
            {numeral(item.POPULATION).format('0.0a')}
          </div>
        )}
        value={this.state.query}
        onChange={event => {
          this.setState({ query: event.target.value });
        }}
        onSelect={value => {
          const item = this.props.values.find(
            item => item.FID.toString() === value
          );
          this.props.onSelect(item);
        }}
      />
    );
  }
}
