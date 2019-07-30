describe("foo", () => {
  it("should work", () => {
    const spy = sinon.spy();
    spy();
    expect(spy).to.be.calledOnce;
  });
});
