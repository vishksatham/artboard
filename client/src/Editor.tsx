
import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, solid, subTreeRoot, replaceSubTree, split } from './square';
import { SquareElem } from "./square_draw";
import { prefix, len } from "./list";

type EditorProps = {
  /** Initial state of the file. */
  initialState: Square;
  onSave : (square: Square) => void;
  doClose : () => void;
};

type EditorState = {
  /** The root square of all squares in the design */
  root: Square;
  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
  /** Save the file name */
  fileSave: string;
  /** Save the selected color names */
  selectedColor: string;

};

/** UI for editing the image. */
export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: EditorProps) {
    super(props);
    this.state = { root: props.initialState, selected: undefined, fileSave: "", selectedColor: "" };

  }
  render = (): JSX.Element => {

    // TODO: add some editing tools here

    return <div> <SquareElem width={600} height={600}

      square={this.state.root} selected={this.state.selected}

      onClick={this.doSquareClick}></SquareElem>

      <button onClick={this.doSplitClick}>Split</button>

      <button onClick={this.doMergeClick}>Merge</button>

      <button onClick={this.doSaveClick}>Save</button>

      <button onClick={this.doCloseClick}>Close</button>
      
      <select onChange ={this.doColorChange} value = {this.state.selectedColor}>

        <option value = "null">Select a color!</option>

        <option value = "white">White</option>

        <option value = "red">Red</option>

        <option value = "orange">Orange</option>

        <option value = "yellow">Yellow</option>

        <option value = "green">Green</option>

        <option value = "blue">Blue</option>
        
        <option value = "purple">Purple</option>

      </select>

      </div>
  }
  
  doSaveClick = (): void => {

    this.props.onSave(this.state.root);
  }

  doSquareClick = (path: Path): void => {

    // TODO: remove this code, do something with the path to the selected square
    this.setState({ root: this.state.root, selected: path });

  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    
    if (this.state.selected !== undefined) {
      
      const square = subTreeRoot(this.state.root, this.state.selected);

      if (square !== undefined && square.kind === "solid") {

        const nSquare = split(square, square, square, square);
        this.setState({root: replaceSubTree(this.state.root, this.state.selected, nSquare)});

      }
    }
  };

  doCloseClick = (event: React.MouseEvent<HTMLButtonElement>): void => {

    event.preventDefault();

    this.setState({selected:undefined});

    this.props.doClose();
  }

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {

    if (this.state.selected !== undefined) {

      const selectSq = subTreeRoot(this.state.root, this.state.selected);

      if (selectSq && selectSq.kind === "solid") {

        const nwSolidSq = solid(selectSq.color);

        const path: Path = prefix(len(this.state.selected) - 1, this.state.selected);

        const updatedRoot = replaceSubTree(this.state.root, path, nwSolidSq);

        this.setState({ root: updatedRoot, selected: "nil" });

      }
    }
  };

  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {

    if (this.state.selected !== undefined) {
      
      //Essentially, set state for each condition
      if (_evt.target.value === "purple") {
        this.setState({ 
          root: replaceSubTree(this.state.root, this.state.selected, solid("purple")) 
        });
      }
      else if (_evt.target.value === "blue") {
        this.setState({ 
          root: replaceSubTree(this.state.root, this.state.selected, solid("blue")) 
        });
      }
      else if (_evt.target.value === "green") {
        this.setState({ 
          root: replaceSubTree(this.state.root, this.state.selected, solid("green")) 
        });
      }
      else if (_evt.target.value === "yellow") {
        this.setState({ 
          root: replaceSubTree(this.state.root, this.state.selected, solid("yellow")) 
        });
      }
      else if (_evt.target.value === "orange") {
        this.setState({ 
          root: replaceSubTree(this.state.root, this.state.selected, solid("orange")) 
        });
      }
      else if (_evt.target.value === "red") {
        this.setState({ 
          root: replaceSubTree(this.state.root, this.state.selected, solid("red"))
        });
      }
      else if (_evt.target.value === "white") {
        this.setState({ 
          root: replaceSubTree(this.state.root, this.state.selected, solid("white")) 
        });
      }

    }

    else {
      console.error("Uh oh, selected square is undefined.")
    }
  };
}
