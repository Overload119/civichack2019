import React from 'react';
import Autocomplete from 'react-autocomplete';
import fuzzysearch from 'fuzzysearch';
import numeral from 'numeral';

type Props = {
  rows: Array<Object>,
};

const PREVIEW_LIMIT = 5;
function TableRow(props) {
  return (
    <tr key={props.FID}>
      <td>{props.UNINAME}</td>
      <td>{numeral(props.POPULATION).format('0.0a')}</td>
    </tr>
  );
}
export default class TablePreview extends React.Component<Props> {
  render() {
    const placesCount = this.props.rows.length;
    return (
      <>
        <p className="has-text-centered">
          We found {placesCount} similar places by population.
        </p>
        <table className="table is-bordered is-fullwidth is-marginless">
          <tbody>
            <tr>
              <th>Places</th>
              <th>Population</th>
            </tr>
            {this.props.rows.slice(0, PREVIEW_LIMIT).map(TableRow)}
          </tbody>
        </table>
        {placesCount > PREVIEW_LIMIT ? (
          <p className="has-text-centered is-size-7">
            ... and {placesCount - PREVIEW_LIMIT} more
          </p>
        ) : null}
      </>
    );
  }
}
