import { expect } from "chai";
import * as sinon from "sinon";

describe("foo", () => {
	it("should work", () => {
		const spy = sinon.spy();
		spy();
		expect(typeof spy === "function").to.equal(true);
	});
});
