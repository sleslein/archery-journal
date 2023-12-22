import { assertEquals } from "https://deno.land/std@0.205.0/assert/mod.ts";
import { tryDecodeArrowValue } from "../arrow-value.ts";

Deno.test("given simple number return points", () => {
  const [isValid, result] = tryDecodeArrowValue("6");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "6",
    points: 6,
    arrowPlacement: undefined,
    targetPlacement: undefined,
  });
});

Deno.test("given 5t it returns 5 points and top arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("5t");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "5t",
    points: 5,
    arrowPlacement: "top",
    targetPlacement: undefined,
  });
});

Deno.test("given 5tl it returns 5 points and top left arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("5tl");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "5tl",
    points: 5,
    arrowPlacement: "top left",
    targetPlacement: undefined,
  });
});

Deno.test("given 5tr it returns 5 points and top right arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("5tr");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "5tr",
    points: 5,
    arrowPlacement: "top right",
    targetPlacement: undefined,
  });
});

Deno.test("given 5l it returns 5 points and left direction", () => {
  const [isValid, result] = tryDecodeArrowValue("5l");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "5l",
    points: 5,
    arrowPlacement: "left",
    targetPlacement: undefined,
  });
});

Deno.test("given 5r it returns 5 points and right arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("5r");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "5r",
    points: 5,
    arrowPlacement: "right",
    targetPlacement: undefined,
  });
});

Deno.test("given 5b it returns 5 points and bottom arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("5b");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "5b",
    points: 5,
    arrowPlacement: "bottom",
    targetPlacement: undefined,
  });
});

Deno.test("given 5bl it returns 5 points and bottom left arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("5bl");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "5bl",
    points: 5,
    arrowPlacement: "bottom left",
    targetPlacement: undefined,
  });
});

Deno.test("given 5br it returns 5 points and bottom right arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("5br");
  assertEquals(isValid, true);
  assertEquals(result, {
    points: 5,
    encodedValue: "5br",
    arrowPlacement: "bottom right",
    targetPlacement: undefined,
  });
});

Deno.test("given t5, it returns 5 points and top targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("t5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "t5",
    points: 5,
    targetPlacement: "top",
    arrowPlacement: undefined,
  });
});
Deno.test("given tr5, it returns 5 points and top right targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("tr5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "tr5",
    points: 5,
    targetPlacement: "top right",
    arrowPlacement: undefined,
  });
});
Deno.test("given tl5, it returns 5 points and top targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("tl5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "tl5",
    points: 5,
    targetPlacement: "top left",
    arrowPlacement: undefined,
  });
});
Deno.test("given l5, it returns 5 points and left targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("l5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "l5",
    points: 5,
    targetPlacement: "left",
    arrowPlacement: undefined,
  });
});
Deno.test("given r5, it returns 5 points and right targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("r5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "r5",
    points: 5,
    targetPlacement: "right",
    arrowPlacement: undefined,
  });
});
Deno.test("given b5, it returns 5 points and bottom targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("b5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "b5",
    points: 5,
    targetPlacement: "bottom",
    arrowPlacement: undefined,
  });
});
Deno.test("given br5, it returns 5 points and bottom right targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("br5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "br5",
    points: 5,
    targetPlacement: "bottom right",
    arrowPlacement: undefined,
  });
});
Deno.test("given bl5, it returns 5 points and bottom left targetPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("bl5");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "bl5",
    points: 5,
    targetPlacement: "bottom left",
    arrowPlacement: undefined,
  });
});

Deno.test("given bl5, it returns 5 points and left targetPlacement and bottom arrowPlacement", () => {
  const [isValid, result] = tryDecodeArrowValue("l5b");
  assertEquals(isValid, true);
  assertEquals(result, {
    encodedValue: "l5b",
    points: 5,
    targetPlacement: "left",
    arrowPlacement: "bottom",
  });
});

Deno.test("given invalid without number, it returns isValid=false", () => {
  const [isValid, result] = tryDecodeArrowValue("lb");
  assertEquals(isValid, false);
  assertEquals(result, { points: 0, encodedValue: "lb" });
});

Deno.test("given invalid tartgetPlacement, it returns isValid=false", () => {
  const [isValid, result] = tryDecodeArrowValue("xxx5lb");
  assertEquals(isValid, false);
  assertEquals(result, { points: 0, encodedValue: "xxx5lb" });
});

Deno.test("given invalid arrowPlacement, it returns isValid=false", () => {
  const [isValid, result] = tryDecodeArrowValue("l5lr");
  assertEquals(isValid, false);
  assertEquals(result, { points: 0, encodedValue: "l5lr" });
});
