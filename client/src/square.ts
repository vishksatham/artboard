import { List } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

/** Converts a string to a color (or throws an exception if not a color). */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "red": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/** Returns a solid square of the given color. */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/** Returns a square that splits into the four given parts. */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};


export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;


/** Returns JSON describing the given Square. */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/** Converts a JSON description to the Square it describes. */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}

/**
 * Given a square and a path, retrieve the root of the subtree at that location (assuming it exists)
 * @param square to start from
 * @param path specifiying the location of the subtree
 * @returns the root of the subtree at the specified location (or undefined if path does not exist)
 */
export const subTreeRoot = (square: Square, path: Path): Square | undefined => {

  if(path === "nil") {
    return square;
  }

  if(path.kind === "cons") {

    const head = path.hd;
    const tail = path.tl
  
    if(square.kind === "split" && head !== undefined && tail !== undefined) {
      if(head === "SE") {
        return subTreeRoot(square.se, tail);
      }
      else if(head === "SW") {
        return subTreeRoot(square.sw, tail);
      }
      else if(head === "NE") {
        return subTreeRoot(square.ne, tail);
      }
      else {
        return subTreeRoot(square.nw, tail);
      }
    }
  }

  return undefined;

}

/**
 * Given a square, a path, and a second square, returns a new square 
 * that is the same as the first one except that the subtree whose root 
 * is at the given path is replaced by the second square.
 * 
 * @param firstSquare the original square where the subtree will be replaced
 * @param path specifying the location of the subtree to be replaced
 * @param secondSquare subtree that will replace the existing subtree
 * @returns 
 */
export const replaceSubTree = (firstSquare : Square, path: Path, secondSquare : Square): Square => {

  if(path === "nil") {
    return secondSquare;
  }

  else if (firstSquare === undefined || firstSquare.kind === "solid") {
    throw new Error("Square is invalid")
  }


  if(path.kind === "cons") {

    const head = path.hd;
    
    const tail = path.tl;

    if(firstSquare.kind === "split") {

      if(head === "SE") {
        return split(firstSquare.nw, firstSquare.ne, firstSquare.sw, replaceSubTree(firstSquare.se, tail, secondSquare));
      }

      else if(head === "SW") {
        return split(firstSquare.nw, firstSquare.ne, replaceSubTree(firstSquare.sw, tail, secondSquare), firstSquare.se);
      }

      else if(head === "NE") {
        return split(firstSquare.nw, replaceSubTree(firstSquare.ne, tail, secondSquare), firstSquare.sw, firstSquare.se);
      }
      else if (head === "NW"){
        return split(replaceSubTree(firstSquare.nw, tail, secondSquare), firstSquare.ne, firstSquare.sw, firstSquare.se);
      }
      
    }
    
  }

  return firstSquare;

}
