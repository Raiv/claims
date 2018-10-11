import React, { Component } from 'react';

import './App.css';
import $  from 'jquery';

var dataGlobal = [
  {id: "claim1", date: "Pete Hunt", text: "This is one claim"},
  {id: "claim2", date: "Jordan Walke", text: "This is *another* claim"}
];

class BoardRow extends Component {

    constructor(props) {
      super(props);
      this.state = {
        value: null,
      };
    }
  render() {
    return (
      <div className="board-row">
          <BoardCell  value={this.props.claim.id}/>
          <BoardCell  value={this.props.claim.date}/>
          <BoardCell  value={this.props.claim.text}/>
      </div>
    );
  }
}

class MyTable extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  loadCommentsFromServer() { // new
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
   // this.setState({data:dataGlobal});
  }
  
  componentDidMount() {
    //new start
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval);
    //new end
  }

    render() {

      var claims = this.state.data.map(function(claim) { 
        return (
          <BoardRow claim={claim}/>
        );
      });

      return (
        <div className="commentList">
          {claims} 
        </div>
      );
    }
  
}

class BoardAddRow extends Component {
  constructor(props) {
    super(props);
    this.state={id: '', date: '', text: ''};
  }

  handleIdChange(e) {
    this.setState({id: e.target.value});
  }

  handleDateChange(e) {
    this.setState({date: e.target.value});
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
   // e.preventDefault();
    var id = this.state.id.trim();
    var text = this.state.text.trim();
    var date = this.state.date.trim();
    if (!id || !text || !date) {
      return;
    }
    dataGlobal.push({id: id, date: date, text: text});

    // TODO: отправить запрос на сервер
    this.setState({id: '', date: '', text: ''});
  }

  render() {
    return (
      <form className="boardForm">
        <input type="text" size="40" name="id"
                    value={this.state.id} 
                    placeholder="claim num"
                    onChange={this.handleIdChange.bind(this)}/>
        <input type="text" size="40" name="date"
                    value={this.state.date} 
                    placeholder="claim date"
                    onChange={this.handleDateChange.bind(this)}/>
        <input type="text" size="40" name="text"
                    value={this.state.text}
                    placeholder="claim text"
                    onChange={this.handleTextChange.bind(this)}/>
        <button onClick={this.handleSubmit.bind(this)}> add </button>
      </form>
    );
  }
}

class BoardCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return <input type="text" size="40" name="claimid" value = {this.props.value} ></input>
  }
}

class Board extends React.Component {

  render() {
    return (
      <div>
        <BoardAddRow />
        <p/>
        <MyTable data = {this.props.data} url='http://localhost:5000/api/claims' pollInterval={2000}/>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>Fabric sample client</div>   
        </header>
        <Board data={dataGlobal}/>
      </div>
    );
  }
}

export default App;
