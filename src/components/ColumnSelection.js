import React from 'react';
import Autocomplete from 'react-autocomplete';
import fuzzysearch from 'fuzzysearch';
import projectDrawdown from '../shared/projectDrawdown';

type Props = {
  selectedColumns: Array<number>,
  onSelectAll: () => void,
  onChangeColumn: solution => void,
  onSelectNone: () => void,
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

const COLUMN_COUNT = 3;
export default class ColumnSelection extends React.Component<Props> {
  onClickSolution = solution => {
    this.props.onChangeColumn(solution);
  };
  render() {
    const sortedSolutionData = [];
    // Organize data so we can sort it by the solution types and the number of solutions.
    Object.keys(projectDrawdown).forEach(solutionType => {
      sortedSolutionData.push({
        solutionType: solutionType,
        solutions: projectDrawdown[solutionType],
      });
    });
    sortedSolutionData.sort(solutionData => {
      return solutionData.solutions.length;
    });
    // Initialize each column.
    const columns = [];
    for (let i = 0; i < COLUMN_COUNT; i++) {
      columns.push([]);
    }
    // Append each of the solution sections to each column from smallest to largest.
    let columnIndex = 0;
    for (let i = 0; i < sortedSolutionData.length; i++) {
      columns[i % COLUMN_COUNT].push(sortedSolutionData[i]);
    }
    return (
      <div className="columns">
        {columns.map(solutions => {
          return (
            <div className="column" key={solutions[0].solutionType}>
              <div className="menu">
                {solutions.map(solution => {
                  return (
                    <SolutionSection
                      header={solution.solutionType}
                      selectedColumns={this.props.selectedColumns}
                      key={solution.solutionType}
                      onClick={this.onClickSolution}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
