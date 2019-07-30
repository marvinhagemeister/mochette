const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("chai-sinon");

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;
