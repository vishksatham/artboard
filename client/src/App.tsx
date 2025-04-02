import React, { ChangeEvent, Component } from "react";
import { solid, split, Square, toJson } from './square';
import { Editor } from "./Editor";
import { isRecord } from "./record";
import { fromJson } from "./square";


type AppState = {

  currentSquare : Square ;

  sqName : string;

  isEditing : boolean;

  colorSelect : String;

  savedFiles : string[];

}

export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    this.state = { currentSquare: split(solid("blue"), solid("orange"), solid("purple"), solid("red")), 
    sqName: "", isEditing: false, colorSelect: "", savedFiles: [] };

  }

  doLoadSquareClick = (name:string): void=> {

    const link = "api/load?name=" + encodeURIComponent(name);
    fetch(link)
    .then((resp) => this.doLoadResponse(resp))
    .catch(() => this.doLoadError("failed to connect to server"));

  }
  
  render = (): JSX.Element => {
    
    // If they wanted this square, then we're done!
    // const sq = split(solid("blue"), solid("orange"), solid("purple"), solid("red"))
  
    // TODO: replace this code with the commented out code below to use Editor

    if (this.state.isEditing === true) {
      return (
        <Editor initialState={this.state.currentSquare} onSave={this.doSaveClick} doClose={this.doCloseButtnClick} />
      );

    } else {
      return (
        <div>
          <h2>Please enter a name for your square design:</h2>
          <input id="savedName" onChange={this.doNameChange}></input>
          <button onClick={this.doEditClick}>Create</button>
          <div>
            <h2>Saved Files:</h2>
          </div>
          {this.renderFiles()}
        </div>
      );
    }
  };
  
  doShowfilesClick = (): void =>{
    const link = "/api/listFiles";
    fetch(link)
      .then((resp) => this.doListResponse(resp))
      .catch(() => this.doLoadError("failed to connect to server"));  
    
  }

  getFiles = (): void => {

  const link = "api/listFiles";
  fetch(link)
    .then((resp) => this.doLoadResponse(resp))
    .catch(() => this.doLoadError("failed to connect to server"));

  }

  renderFiles = (): JSX.Element => {
    fetch("/api/listFiles")
    .then(this.doLoadResponse)
    .catch(() => this.doLoadError("failed to connect to server"));

    const stuffs : JSX.Element[] = [];
    for (const stuff of this.state.savedFiles) {
      stuffs.push(<a href="#" onClick = {() => this.doSquareClick(stuff)}>{stuff}</a>);
      stuffs.push(<div></div>)
    }

    return <div>{stuffs}</div>;
    
  }

  

  doNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ sqName: event.target.value });
  }

  doShowEditorChange = (): void => {
    this.setState({currentSquare: solid("orange"), isEditing: !this.state.isEditing})
  }

  doSaveError = (msg: string): void => {
    console.error(`Error fetching /save: ${msg}`);
  };

  doLoadError = (msg: string): void => {
    console.error(`Error fetching /load: ${msg}`);
  };

  doListResponse = (resp: Response): void => {
    if (resp.status === 200) {

      resp.json().then(this.doListJson)
          .catch(() => this.doSaveError("200 response is not valid JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doSaveError)
          .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code from /api/listFiles: ${resp.status}`);
    }

  };

  doLoadResponse = (res : Response): void => {
    if (res.status === 200) {
      res.json().then(this.doListJson)
          .catch(() => this.doLoadError("200 res is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
          .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`${res.status}: bad status code`);
    }
  }

  doLoadSquareResponse = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doLoadJson)
          .catch(() => this.doLoadError("200 res is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
          .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`${res.status}: bad status code`);
    }
  }

  doLoadJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/load: not a record", data);
      return;
    }

    this.setState({currentSquare: fromJson(data.value), isEditing: !this.state.isEditing});

  };  

  doListJson = (data: unknown): void => {

    if (!isRecord(data)) {
      console.error("bad data from /listFiles: not a record", data);
      return;
      
    }

    const dataVals = data.value;

    if (dataVals !== undefined && Array.isArray(dataVals)) {
      this.setState({savedFiles: dataVals});
    }
  };

  doSaveJson = (val: unknown) : void => {
    if (!isRecord(val)) {
      console.error("bad data from /save: not a record", val)
      return;
    }
  }

  doSaveResponse = (res: Response): void => {

    if (res.status === 200) {
      
      res.json().then((this.doSaveJson))
         .catch(() => this.doSaveError("200 response is not valid JSON"));

    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
         .catch(() => this.doSaveError("400 response is not text"));

    } else {
      this.doSaveError(`bad status code ${res.status}`);
    }
  }

  doSaveClick = (square: Square): void => {
    
    const fileName = this.state.sqName
    if (typeof fileName !== 'string' || fileName === "") {

      console.error('Invalid name:', fileName);
      return;
    }
  
    const payload = {
      name: fileName,
      json: toJson(square)
    };

    fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(this.doSaveResponse)
      .catch(() => this.doSaveError("failed to connect to the server"));
  };


  doEditClick = (): void => {
    const sq = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
    this.setState({ currentSquare: sq, isEditing: true });
  }

  doSquareClick = (name: string): void => {

    //console.log(path);
    //alert("Stop that!");
    
    const link : string = "api/load?name=" + encodeURIComponent(name);
    fetch(link)
    .then((response) => this.doLoadSquareResponse(response))
    .catch(() => this.doLoadError("failed to connect to server"));

  };

  // TODO: add some functions to access routes and handle state changes probably

  doCloseButtnClick = (): void => {

    this.setState({isEditing: false});
      
  }

}