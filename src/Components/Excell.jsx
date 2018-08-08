import React, { Component } from "react";
import PropTypes from "prop-types";

class Excell extends Component {
    displayName = "Excel";
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null,
            search: false,
            serchColumn: []
        };
    }

    _preSearchData: null;

    _sort = e => {
        let column = e.target.cellIndex;
        let data = [...this.state.data];
        let descending = this.state.sortby === column && !this.state.descending;
        data.sort(function(a, b) {
            return descending
                ? a[column] < b[column]
                    ? 1
                    : -1
                : a[column] > b[column]
                    ? 1
                    : -1;
        });
        this.setState({
            data: data,
            sortby: column,
            descending: descending
        });
    };
    _showEditor = e => {
        this.setState({
            edit: {
                row: parseInt(e.target.dataset.row, 10),
                cell: e.target.cellIndex
            }
        });
    };
    _save = e => {
        e.preventDefault();
        var input = e.target.firstChild;
        let data = [...this.state.data];
        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this.setState({
            edit: null, // редактирование выполнено
            data: data
        });
    };
    _renderTable() {
        return (
            <table>
                <thead>
                    <tr>
                        {this.props.headers.map((title, i) => {
                            if (this.state.sortby === i) {
                                title += this.state.descending
                                    ? " \u2191"
                                    : " \u2193";
                            }
                            return (
                                <th key={i} onClick={this._sort}>
                                    {title}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor}>
                    {this._renderSearch()}
                    {this.state.data.map((row, rowI) => {
                        for (let j = 0; j < row.length; j++) {
                            const element = row[j];
                            let needle = this.state.serchColumn[j];
                            if (needle) {
                                if (
                                    !~element
                                        .toString()
                                        .toLowerCase()
                                        .indexOf(needle)
                                ) {
                                    return false;
                                }
                            }
                        }
                        return (
                            <tr key={rowI}>
                                {row.map((cell, i) => {
                                    let edit = this.state.edit;
                                    let content = cell;
                                    if (
                                        edit &&
                                        edit.row === rowI &&
                                        edit.cell === i
                                    ) {
                                        content = (
                                            <form onSubmit={this._save}>
                                                <input
                                                    type="text"
                                                    defaultValue={content}
                                                />
                                            </form>
                                        );
                                    }
                                    return (
                                        <td key={i} data-row={rowI}>
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
    _renderToolbar() {
        return (
            <div className="toolbar">
                <button onClick={this._toogleSearch}>
                    {this.state.search ? "Выполняется поиск" : "Search"}
                </button>
                <a onClick={this._download.bind(this, "json")} href="data.json">
                    Export JSON
                </a>
                <a onClick={this._download.bind(this, "csv")} href="data.json">
                    Export CSV
                </a>
            </div>
        );
    }
    _download(format, ev) {
        let contents =
            format === "json"
                ? JSON.stringify(this.state.data)
                : this.state.data.reduce(function(result, row) {
                      return (
                          result +
                          row.reduce(function(rowresult, cell, idx) {
                              return (
                                  rowresult +
                                  '"' +
                                  cell.replace(/"/g, '""') +
                                  '"' +
                                  (idx < row.length - 1 ? "," : "")
                              );
                          }, "") +
                          "\n"
                      );
                  }, "");
        var URL = window.URL || window.webkitURL;
        var blob = new Blob([contents], { type: "text/" + format });
        ev.target.href = URL.createObjectURL(blob);
        ev.target.download = "data." + format;
    }
    _toogleSearch = () => {
        if (this.state.search) {
            this.setState({ data: this._preSearchData, search: false });
            this._preSearchData = null;
        } else {
            this._preSearchData = this.state.data;
            this.setState({ search: true });
        }
    };
    _renderSearch() {
        if (!this.state.search) {
            return null;
        }
        return (
            <tr onChange={this._search}>
                {this.props.headers.map((_ignore, i) => {
                    return (
                        <td key={i}>
                            <input type="text" data-idx={i} />
                        </td>
                    );
                })}
            </tr>
        );
    }
    _search = e => {
        let needle = e.target.value.toLowerCase();
        let serchColumn = this.state.serchColumn;
        let idx = e.target.dataset.idx; // в каком столбце искать
        serchColumn[idx] = needle;
        if (!needle) {
            this.setState({
                serchColumn
            });
            return;
        }
        this.setState({
            serchColumn
        });
    };

    render() {
        return (
            <div>
                {this._renderToolbar()}
                {this._renderTable()}
            </div>
        );
    }
}
Excell.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default Excell;
