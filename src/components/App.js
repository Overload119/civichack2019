import React from 'react';
import TAFFY from 'taffydb';
import Papa from 'papaparse';
import Search from './Search';
import ColumnSelection from './ColumnSelection';
import TablePreview from './TablePreview';
import projectDrawdown from '../shared/projectDrawdown';

type State = {
  isLoaded: false,
  selectedColumns: Array<string>
};

const IGNORED_COLUMNS = ['___s', '___id'];

export default class App extends React.Component {
  db = TAFFY.taffy();
  state: State = {
    isLoaded: false,
    selectedFid: null,
    similarRows: [],
    selectedColumns: []
  };

  render() {
    return (
      <>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Welcome to Climate Wiki</h1>
              <h2 className="subtitle">Where are you?</h2>
              <div className="is-fullwidth">
                <Search
                  onSelect={selection => {
                    const minPopulation = selection.POPULATION * 0.99;
                    const maxPopulation = selection.POPULATION * 1.5;

                    const similarRows = this.db(
                      { POPULATION: { gt: minPopulation } },
                      { POPULATION: { lt: maxPopulation } }
                    ).get();

                    this.setState({ selectedFid: selection.FID, similarRows });
                  }}
                  values={
                    this.state.isLoaded
                      ? this.db()
                          .limit(100)
                          .get()
                      : []
                  }
                />
              </div>
              {this.state.isLoaded ? null : (
                <input type="file" id="upload" onChange={this.onAddFile} />
              )}
            </div>
          </div>
        </section>
        {this.state.similarRows.length > 0 ? (
          <section className="section">
            <TablePreview rows={this.state.similarRows} />
          </section>
        ) : null}
        {this.state.selectedFid ? (
          <section>
            <ColumnSelection
              selectedColumns={this.state.selectedColumns}
              onSelectAll={this.onSelectAll}
              onChangeColumn={this.onChangeColumn}
              onSelectNone={this.onSelectNone}
            />
          </section>
        ) : null}
        {this.state.isLoaded ? (
          <section className="section">
            <button className="button" onClick={this.onExportCSV}>
              Export CSV
            </button>
          </section>
        ) : null}
      </>
    );
  }

  onChangeColumn = solution => {
    const isOn = this.state.selectedColumns.includes(solution);
    isOn
      ? this.setState({
          selectedColumns: this.state.selectedColumns.filter(
            s => s !== solution
          )
        })
      : this.setState({
          selectedColumns: this.state.selectedColumns.concat([solution])
        });
  };

  onSelectAll() {
    const allColumns = [];
    Object.keys(projectDrawdown).forEach(heading => {
      projectDrawdown[heading].forEach(solution => {
        allColumns.push(solution);
      });
    });
    this.setState({ selectedColumns: allColumns });
  }

  onSelectNone() {
    this.setState({ selectedColumns: [] });
  }

  onExportCSV = () => {
    const firstReferenceRow = this.state.similarRows[0];
    const initialHeaders = Object.keys(firstReferenceRow).filter(
      prop => !IGNORED_COLUMNS.includes(prop)
    );

    // Add the solutions as headers.
    const finalHeaders = initialHeaders.concat(this.state.selectedColumns);

    // Create an array of data representing each row.
    const rowData = [];
    this.state.similarRows.forEach(row => {
      this.state.selectedColumns.forEach(solution => {
        row[solution] = `${row.UNINAME} ${solution}`;
      });
      rowData.push(row);
    });

    let csv = finalHeaders.sort().join(', ') + '\n';
    // Convert the rowData (Object) into a single-line CSV row
    rowData.forEach(row => {
      const rowCSV = Object.keys(row)
        .filter(prop => !IGNORED_COLUMNS.includes(prop))
        .sort()
        .map(prop => {
          return row[prop].toString().replace(/,/g, '');
        })
        .join(', ');
      csv += rowCSV;
      csv += '\n';
    });

    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'export.csv';
    hiddenElement.click();
  };

  onAddFile = event => {
    const file = event.target.files[0];
    Papa.parse(file, {
      worker: true,
      dynamicTyping: true,
      header: true,
      step: row => {
        const rowData = row.data;
        this.db.insert(row.data);
      },
      complete: () => {
        this.setState({
          isLoaded: true
        });
        console.log(this.db().first());
      }
    });
  };
}
