export type EncodedDirection =
  | "t"
  | "tm"
  | "tl"
  | "tr"
  | "r"
  | "b"
  | "br"
  | "bl"
  | "b"
  | "l"
  | "m"
  | "bm";

export type DecodedDirection =
  | "top"
  | "top left"
  | "top right"
  | "top middle"
  | "right"
  | "middle"
  | "left"
  | "bottom"
  | "bottom left"
  | "bottom right"
  | "bottom middle";

export type DecodedArrow = {
  encodedValue: string;
  points: number;
  arrowPlacement?: DecodedDirection;
  targetPlacement?: DecodedDirection;
};

const directionMap = new Map<EncodedDirection, DecodedDirection>([
  ["t", "top"],
  ["tr", "top right"],
  ["tl", "top left"],
  ["tm", "top middle"],
  ["r", "right"],
  ["m", "middle"],
  ["l", "left"],
  ["b", "bottom"],
  ["br", "bottom right"],
  ["bm", "bottom middle"],
  ["bl", "bottom left"],
]);

type GroupValues = [
  string,
  EncodedDirection | undefined,
  string,
  EncodedDirection | undefined,
];

export function tryDecodeArrowValue(
  encoded: string,
): [boolean, DecodedArrow] {
  const regex = /^([a-zA-Z]{0,2})?(\d{0,2})([a-zA-Z]{0,2})?$/gi;
  const val = regex.exec(encoded);
  const [encodedValue, targetPlacementGroup, pointGroup, arrowPlacementGroup] =
    (val ?? [encoded, undefined, "", undefined]) as GroupValues;

  const points = parseInt(pointGroup);
  const arrowPlacement: DecodedDirection | undefined = arrowPlacementGroup
    ? directionMap.get(arrowPlacementGroup)
    : undefined;
  const targetPlacement = targetPlacementGroup
    ? directionMap.get(targetPlacementGroup)
    : undefined;

  // Not valid
  if (
    !pointGroup ||
    (pointGroup && (points < 0 || points > 10)) ||
    (targetPlacementGroup && !targetPlacement) ||
    (arrowPlacementGroup && !arrowPlacement)
  ) {
    return [false, { encodedValue: encoded, points: 0 }];
  }

  return [true, {
    encodedValue,
    arrowPlacement,
    points,
    targetPlacement,
  }];
}
