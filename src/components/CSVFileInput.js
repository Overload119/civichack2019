import React from 'react';
import classNames from 'classnames';

type Props = {
  onChange: () => void,
  isLoading: boolean,
};

export default class CSVFileInput extends React.Component<Props> {
  render() {
    return (
      <div className="file is-boxed">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            onChange={this.props.onChange}
          />
          <span
            className={classNames('file-cta', {
              button: this.props.isLoading,
              'is-loading': this.props.isLoading,
            })}
          >
            <span className="file-label">Choose a file…</span>
          </span>
        </label>
      </div>
    );
  }
}
