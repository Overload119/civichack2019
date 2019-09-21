import React from 'react';
import Autocomplete from 'react-autocomplete';
import fuzzysearch from 'fuzzysearch';
import projectDrawdown from '../shared/projectDrawdown';

type Props = {
  selectedColumns: Array<number>,
  onSelectAll: () => void,
  onChangeColumn: solution => void,
  onSelectNone: () => void
};

function SolutionSection(props) {
  const solutions = projectDrawdown[props.header];
  return (
    <>
      <p className="menu-label">{props.header}</p>
      <ul className="menu-list">
        {solutions.map(solution => {
          const isSelected = props.selectedColumns.includes(solution);
          return (
            <li key={solution}>
              <a
                className={isSelected ? 'is-active' : null}
                onClick={() => {
                  props.onClick(solution);
                }}
              >
                {solution}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default class ColumnSelection extends React.Component<Props> {
  onClickSolution = solution => {
    this.props.onChangeColumn(solution);
  };
  render() {
    return (
      <div className="menu">
        {Object.keys(projectDrawdown).map(header => {
          return (
            <SolutionSection
              header={header}
              selectedColumns={this.props.selectedColumns}
              key={header}
              onClick={this.onClickSolution}
            />
          );
        })}
      </div>
    );
  }
}
