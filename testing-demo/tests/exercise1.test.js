const exercise = require("../exercise1");

describe("fizzbuzz", () => {
  it("shoud throw error when input is not number", () => {
    const args = ["adsds", null, undefined, {}];
    args.forEach(a => {
      expect(() => {
        exercise.fizzBuzz(a);
      }).toThrow();
    });
  });
  it("should return same input", () => {
    const result = exercise.fizzBuzz(7);

    expect(result).toBe(7);
  });

  it("should return fizz", () => {
    const result = exercise.fizzBuzz(6);

    expect(result).toContain("Fizz");
  });
  it("should return buzz", () => {
    const result = exercise.fizzBuzz(5);

    expect(result).toContain("Buzz");
  });
  it("should return fizz-buzz", () => {
    const result = exercise.fizzBuzz(15);

    expect(result).toContain("FizzBuzz");
  });
});
