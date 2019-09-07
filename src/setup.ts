import { expect } from "chai";
import * as sinon from "sinon"
import { JSDOM } from "jsdom";
import { performance } from "perf_hooks";

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
`);

(global as any).expect = expect;
(global as any).sinon = sinon;
(global as any).document = dom.window.document;
(global as any).window = dom.window;
(global as any).performance = performance;
