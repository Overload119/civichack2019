import React from 'react';
import Autocomplete from 'react-autocomplete';
import fuzzysearch from 'fuzzysearch';

type Props = {
  rows: Array<Object>
};

function TableRow(props) {
  return (
    <tr key={props.FID}>
      <td>{props.UNINAME}</td>
      <td>{props.POPULATION}</td>
    </tr>
  );
}
export default class TablePreview extends React.Component<Props> {
  render() {
    const placesCount = this.props.rows.length;
    return (
      <>
        <table className="table is-fullwidth">
          <tbody>
            <tr>
              <th>{placesCount} Similar Places</th>
              <th>Population</th>
            </tr>
            {this.props.rows.slice(0, 10).map(TableRow)}
          </tbody>
        </table>
        {placesCount > 10 ? (
          <p className="has-text-centered">... and {placesCount - 10} more</p>
        ) : null}
      </>
    );
  }
}
