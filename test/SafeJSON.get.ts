import assert from "assert";
import { SafeAny } from "../lib/SafeAny";
import { Type } from "../lib/Type";

describe("SafeAny.get(key)", () => {
    it("should return \"value\"", () => {
        const sj = new SafeAny({
            level1: {
                level2: {
                    key: "value",
                },
            },
        });
        assert.deepStrictEqual(sj.get("level1").get("level2").get("key").stringValue(), "value");
    });
    it("should return \"world\"", () => {
        const sj = new SafeAny({
            level1: {
                level2: [
                    {},
                    {
                        hello: "world",
                    },
                    {},
                ],
            },
        });
        assert.deepStrictEqual(sj.get("level1").get("level2").get(1).get("hello").stringValue(), "world");
    });
    it("should return null", () => {
        const sj = new SafeAny({
            level1: {},
        });
        assert.deepStrictEqual(sj.get("level1").get("level2").get(1).get("hello").stringOrNull(), null);
    });
    it("should return \"John\"", () => {
        const parsedJSON = {
            persons: [
                {
                    firstName: "John",
                    lastName: "Appleseed",
                },
            ],
        };
        const object = new SafeAny(parsedJSON);
        const value = object
          .get("persons")
          .get(0)
          .get("firstName")
          .stringOrDefault("no name");
        assert.deepStrictEqual(value, "John");
    });
    it("should return \"value\"", () => {
        const sj = new SafeAny(
          [
              [],
              [
                  [
                      "index0",
                      "value",
                      "index2",
                  ],
              ],
              [],
          ],
        );
        assert.deepStrictEqual(sj.get(1).get(0).get(1).stringValue(), "value");
    });
    it("should return \"world\"", () => {
        const sj = new SafeAny(
          [
              {
                  level1: [
                      "index0",
                      "index1",
                      "index2",
                      "world",
                  ],
              },
          ],
        );
        assert.deepStrictEqual(sj.get(0).get("level1").get(3).stringValue(), "world");
    });
    it("should return null", () => {
        const sj = new SafeAny(
          [],
        );
        assert.deepStrictEqual(sj.get(0).get("level1").get(3).stringOrNull(), null);
    });
    it("should return null at bad array index", () => {
        const sj = new SafeAny(
          [
              1,
              2,
              3,
          ],
        );
        assert.deepStrictEqual(sj.get(0).numberOrNull(), 1);
        assert.deepStrictEqual(sj.get(1).numberOrNull(), 2);
        assert.deepStrictEqual(sj.get(2).numberOrNull(), 3);
        assert.deepStrictEqual(sj.get(3).numberOrNull(), null);
        assert.deepStrictEqual(sj.get(8).numberOrNull(), null);
    });
    it("should return null with bad key type", () => {
        const sj = new SafeAny({
            hello: "world",
        });
        assert.deepStrictEqual(sj.get({} as any).type, Type.null);
    });
});
