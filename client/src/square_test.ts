import * as assert from 'assert';
import { solid, split, toJson, fromJson, subTreeRoot, Square, Path, replaceSubTree } from './square';
import { nil, cons } from './list';

describe('square', function () {

  it('toJson', function () {
    assert.deepEqual(toJson(solid("white")), "white");
    assert.deepEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
      ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
        "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function () {
    assert.deepEqual(fromJson("white"), solid("white"));
    assert.deepEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepEqual(
      fromJson([["blue", "orange", "purple", "white"], "green",
      ["blue", "orange", "purple", "white"], "red"]),
      split(s1, solid("green"), s1, solid("red")));

    assert.deepEqual(
      fromJson(["green", ["blue", "orange", "purple", "white"],
        "yellow", ["blue", "orange", "purple", "white"]]),
      split(solid("green"), s1, solid("yellow"), s1));
  });

  it('subTreeRoot', function () {

    //0-1-many testing (base case)
    const empty: Path = nil;
    const solidBlueSq: Square = { kind: "solid", color: "blue" };

    assert.deepStrictEqual(subTreeRoot(solidBlueSq, empty), solidBlueSq);

    //0-1-many testing (1 recursive call)
    const solidYellowSq: Square = { kind: "solid", color: "yellow" };
    const solidGreenSq: Square = { kind: "solid", color: "green" };

    const x: Path = cons("NW", cons("SE", nil));
    const square1: Square = { kind: "split", se: solidGreenSq, sw: solidGreenSq, ne: solidGreenSq, nw: solidYellowSq }
    const square2: Square = { kind: "split", se: solidGreenSq, sw: solidGreenSq, ne: solidGreenSq, nw: square1 }

    assert.deepStrictEqual(subTreeRoot(square2, x), solidGreenSq);

    //0-1-many testing (1 recursive call)
    const solidPurpleSq: Square = { kind: "solid", color: "purple" };
    const solidRedSq: Square = { kind: "solid", color: "green" };

    const y: Path = cons("SW", cons("NE", nil));
    const square3: Square = { kind: "split", ne: solidPurpleSq, nw: solidPurpleSq, se: solidRedSq, sw: solidRedSq }
    const square4: Square = { kind: "split", ne: solidRedSq, nw: solidRedSq, se: solidRedSq, sw: square3 }

    assert.deepStrictEqual(subTreeRoot(square4, y), solidPurpleSq);

    //0-1-many testing (mult. recursive call)
    const a: Path = cons("SW", cons("NW", cons("SE", cons("NE", nil))));
    const neTestSquare: Square = { kind: "split", se: solidYellowSq, sw: solidGreenSq, ne: solidPurpleSq, nw: solidRedSq }
    const seTestSquare: Square = { kind: "split", se: neTestSquare, sw: solidGreenSq, ne: solidGreenSq, nw: solidGreenSq }
    const nwTestSquare: Square = { kind: "split", se: solidRedSq, sw: solidGreenSq, ne: solidGreenSq, nw: seTestSquare }
    const swTestSquare: Square = { kind: "split", se: solidRedSq, sw: nwTestSquare, ne: solidGreenSq, nw: solidYellowSq }

    assert.deepStrictEqual(subTreeRoot(swTestSquare, a), solidPurpleSq);

    //0-1-many testing (mult. recursive call)
    const b: Path = cons("NE", cons("SE", cons("NW", cons("SW", nil))));
    const swTestSquare2: Square = { kind: "split", se: solidRedSq, sw: solidPurpleSq, ne: solidGreenSq, nw: solidYellowSq }
    const nwTestSquare2: Square = { kind: "split", se: solidRedSq, sw: solidGreenSq, ne: solidGreenSq, nw: swTestSquare2 }
    const seTestSquare2: Square = { kind: "split", se: nwTestSquare2, sw: solidGreenSq, ne: solidGreenSq, nw: solidGreenSq }
    const neTestSquare2: Square = { kind: "split", se: solidYellowSq, sw: solidGreenSq, ne: seTestSquare2, nw: solidRedSq }

    assert.deepStrictEqual(subTreeRoot(neTestSquare2, b), solidPurpleSq);

  })

  it('replaceSubTree', function () {

    //constants used for single/mult. recursive testing
    const solidPurpleSq: Square = { kind: "solid", color: "purple" };
    const solidYellowSq: Square = { kind: "solid", color: "yellow" };
    const empty: Path = nil;

    //constants for single recursive testing
    const square1 = split(solid("yellow"), solid("purple"), solid("red"), solid("green"));
    const square2 = split(solid("purple"), solid("purple"), solid("red"), solid("green"));
    const square3 = split(solid("purple"), solid("purple"), solid("yellow"), solid("green"));

    //0-1-many testing: base case (0 recursive calls)
    assert.deepStrictEqual(replaceSubTree(solidPurpleSq, empty, solidYellowSq), solidYellowSq);

    //0-1-many testing: 1 recursive call
    assert.deepStrictEqual(replaceSubTree(square1, cons("NW", nil), solid("purple")), square2);

    //0-1-many testing: 1 recursive call
    assert.deepStrictEqual(replaceSubTree(square2, cons("SW", nil), solid("yellow")), square3);

    //0-1-many testing: mult. recursive calls (2+)
    const path1: Path = cons("SW", cons("NW", cons("SE", cons("NE", nil))));

    const neSq1: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: solidPurpleSq, se: solidYellowSq };
    const seSq1: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: solidYellowSq, se: neSq1 };
    const nwSq1: Square = { kind: "split", nw: seSq1, ne: solidYellowSq, sw: solidYellowSq, se: solidYellowSq };

    const testSq1: Square = { kind: "split", nw: solidYellowSq, ne: solidPurpleSq, sw: nwSq1, se: solidYellowSq };

    const neSq2: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: solidPurpleSq, se: solidYellowSq };
    const seSq2: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: solidYellowSq, se: neSq2 };
    const nwSq2: Square = { kind: "split", nw: seSq2, ne: solidYellowSq, sw: solidYellowSq, se: solidYellowSq };


    const testSq2: Square = { kind: "split", nw: solidYellowSq, ne: solidPurpleSq, sw: nwSq2, se: solidYellowSq };


    assert.deepStrictEqual(replaceSubTree(testSq1, path1, solidYellowSq), testSq2);

    //0-1-many testing: mult. recursive calls (2+)
    const path2: Path = cons("SE", cons('NE', cons("SW", cons("NW", nil))));

    const nwSq3: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: solidYellowSq, se: solidYellowSq };
    const swSq3: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: nwSq3, se: solidYellowSq };
    const neSq3: Square = { kind: "split", nw: solidPurpleSq, ne: swSq3, sw: solidYellowSq, se: solidPurpleSq };

    const testSq3: Square = { kind: "split", nw: solidYellowSq, ne: solidYellowSq, sw: solidYellowSq, se: neSq3 };

    const nwSq4: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: solidYellowSq, se: solidYellowSq };
    const swSq4: Square = { kind: "split", nw: solidPurpleSq, ne: solidYellowSq, sw: nwSq4, se: solidYellowSq };
    const neSq4: Square = { kind: "split", nw: solidPurpleSq, ne: swSq4, sw: solidYellowSq, se: solidPurpleSq };

    const testSq4: Square = { kind: "split", nw: solidYellowSq, ne: solidYellowSq, sw: solidYellowSq, se: neSq4 };

    assert.deepStrictEqual(replaceSubTree(testSq3, path2, solidPurpleSq), testSq4);


  });


});
