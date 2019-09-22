import React from 'react';
import Autocomplete from 'react-autocomplete';
import fuzzysearch from 'fuzzysearch';
import numeral from 'numeral';
import classNames from 'classNames';

type Props = {
  db: any,
  values: Array<Object>,
};
type State = {
  query: string,
};
export default class Search extends React.Component<Props> {
  state: State = {
    query: '',
  };
  render() {
    const startsWith = new RegExp(`^${this.state.query}`, 'i');
    const items = this.props.db({ UNINAME: { regex: startsWith } }).get();
    return (
      <Autocomplete
        menuStyle={{
          borderRadius: '3px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          background: '#FFF',
          padding: '2px 0',
          fontSize: '90%',
          position: 'fixed',
          overflow: 'auto',
          zIndex: 10,
          maxHeight: '50%',
        }}
        wrapperStyle={{
          className: 'is-block',
        }}
        inputProps={{
          className: 'input',
        }}
        getItemValue={item => item.FID.toString()}
        shouldItemRender={(item, value) => {
          if (this.state.query.length <= 1 || value == null) {
            return false;
          }
          return fuzzysearch(value.toLowerCase(), item.UNINAME.toLowerCase());
        }}
        items={items}
        renderItem={(item, isHighlighted) => (
          <div
            key={item.FID}
            className={classNames('dropdown-item', {
              'is-active': isHighlighted,
            })}
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
            item => item.FID.toString() === value,
          );
          this.setState({ query: item.UNINAME }, this.props.onSelect(item));
        }}
      />
    );
  }
}
