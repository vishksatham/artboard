import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Map declared to store transcripts
const savedFiles: Map<string, unknown> = new Map<string, unknown>();

/** Returns a list of all the named save files. */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  res.send({greeting: `Hi, ${name}`});
};

/** Handles request for /save by storing the given transcript. */
export const save = (req: SafeRequest, res: SafeResponse): void => {

  const json = req.body.json;

  const name = req.body.name;

  if (name === undefined || typeof name !== 'string' || name === "") {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  if (json === undefined || !Array.isArray(json) ) {
    res.status(400).send('invalid JSON'); 
    return;
  }

  savedFiles.set(name, json);

  res.send('valid JSON');

};

/** Used in tests to set the transcripts map back to empty. */
export const resetForTesting = (): void => {

  // Removes all saved transcripts from the map
  savedFiles.clear();

};

/** Handles request for /load by returning the transcript requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  
  const name = first(req.query.name);

  if(name === undefined || name === "") {
    res.status(400).send("Uh oh, name was not provided");
    return;
  }

  if(savedFiles.has(name) === false) {
    res.status(400).send("Uh oh, name does not exist");
    return;
  }

  res.send({value: savedFiles.get(name)});
  
}

/**Lists the names of all of the files in use */
export const listFiles = (_req: SafeRequest, res: SafeResponse): void => {

  const files : string[] = [];

  for (const key of savedFiles.keys()){
    files.push(key)
  }

  res.send({value: files})
  return;

}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
