import { fc, test } from '@fast-check/vitest';
import { describe, expect } from 'vitest';
import { extract } from '../src/extract.js';


function pred_GtEq10(_k: unknown, v: unknown): number|undefined {
  if (typeof v === 'number' && v >= 10)
    return v;
  return undefined;
}

const pred_none = ()                   => undefined
const pred_all  = (_k: string, v: any) => v


test('docstring example', () => {
  const { actual, expected } = docstringExample();
  expect(actual).toEqual(expected);
});


describe('properties', () => {

  test.prop([fc.object()])('none', (obj) => {
    const result = extract(obj, pred_none);
    expect(result).toEqual([]);
  });


  test.prop([arb_definedValues])('all', (obj) => {
    const result = extract(obj, pred_all);
    expect(result).toEqual(Object.values(obj));
  });

  test.prop([fc.object()])('pick numeric values', (obj) => {
    const keys: Set<number> = new Set();

    const pred = (_k: any, v: unknown): number|undefined => {
      if (typeof v === 'number') { keys.add(v); return v; }
      return undefined;
    }

    const result = new Set(extract(obj, pred));
    expect(result).toEqual(keys);
  });

  test.prop([fc.anything()])('no error if given strange objects', (x) => {
    const f = () => extract(x, pred_none)
    expect(f).not.toThrow()
  })

  test.prop([arbTree])('tree: values>=10', (tree) => {
    function allGtEq10(arr: unknown[]) {
      return arr.every(x => typeof x === 'number' && x>=10)
    }

    const result = extract(tree, pred_GtEq10);
    expect(result).toSatisfy(allGtEq10);
  })

});


const arb_definedValues = fc.object({values:[
  fc.nat(),
  fc.string(),
  fc.boolean(),
]})

const { tree: arbTree } = fc.letrec((tie) => ({
  tree: fc.oneof(
    { depthSize: 'medium', withCrossShrink: true },
    tie('leaf'),
    tie('nodeArray'),
    tie('nodeRecord'),
  ),
  nodeArray: fc.array(tie('tree'), {maxLength: 5}),
  nodeRecord: fc.record({
    left : tie('tree'),
    right: tie('tree'),
  }),
  leaf: fc.nat({max: 20}).map(x => ({value: x}))
}));

function docstringExample() {
  const root = {
    A: 1,
    b: 0,
    c: {
      99: [{A:2}, {e:"zero"}, null],
      A: 3
    }
  }

  function pred(k: string, v: any): number|undefined {
    if (k === 'A' && typeof v === 'number')
      return v
    return undefined
  }

  const result = extract<number>(root, pred)

  return {
    actual  : result,
    expected: [1, 2, 3]
  }
}
