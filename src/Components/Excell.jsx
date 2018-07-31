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
            edit: null
        };
    }

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

    render() {
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
                    {this.state.data.map((row, rowI) => {
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
}
Excell.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default Excell;
