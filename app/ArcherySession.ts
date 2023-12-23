import { DecodedArrow, tryDecodeArrowValue } from "./arrow-value.ts";

interface SessionDetails {
  date: string;
  distance?: string;
  arrows: Array<[boolean, DecodedArrow]>;
}

export class ArcherySession implements SessionDetails {
  date: string;
  distance: string;
  arrows: Array<[boolean, DecodedArrow]> = [];
  stats: SessionStats;

  constructor(encodedSession: string) {
    const [encodedDate, encodedDistance, ...encodedArrows] = encodedSession
      .split(" ");

    this.date = encodedDate;
    this.distance = encodedDistance.replace("distance:", "");
    encodedArrows.map((strArrow) => {
      this.arrows.push(tryDecodeArrowValue(strArrow));
    });

    this.stats = calcSessionStats(this.arrows);
  }

  save() {
    const encodedValue = ArcherySession.encodeSession({
      date: this.date,
      distance: this.distance,
      arrows: this.arrows.map((arrow) => {
        const [_, arw] = arrow;
        return arw.encodedValue;
      }),
    });
    Deno.writeTextFileSync(
      "./arch-jrnl.txt",
      `${encodedValue} \n`,
      { append: true },
    );
  }

  updateArrow(index: number, encodedValue: string) {
    const x = tryDecodeArrowValue(encodedValue);
    this.arrows[index] = x;
  }

  static encodeSession(
    { date, distance, arrows }: EncodeSessionParams,
  ): string {
    return `${date} distance:${distance} ${arrows.join(" ")}`;
  }
}

interface EncodeSessionParams {
  date: string;
  distance?: string;
  arrows: (string | number)[];
}

export type SessionStats = {
  totalArrows: number;
  totalPoints: number;
  misses: number;
  tens: number;
  avg: number;
  invalidEntries: string[];
};

function calcSessionStats(
  arrows: Array<[boolean, DecodedArrow]>,
): SessionStats {
  let totalArrows = 0,
    totalPoints = 0,
    misses = 0,
    tens = 0;

  const invalidEntries: string[] = [];

  arrows.forEach(([isValid, decodedArrow]) => {
    if (!isValid) {
      invalidEntries.push(decodedArrow.encodedValue);
      return;
    }

    totalArrows += 1;
    totalPoints += decodedArrow?.points ?? 0;
    if (decodedArrow?.points === 0) {
      misses += 1;
    } else if (decodedArrow?.points === 10) {
      tens += 1;
    }
  });

  const avg = totalArrows > 0 ? totalPoints / totalArrows : 0;

  return {
    totalArrows,
    totalPoints,
    misses,
    tens,
    avg,
    invalidEntries,
  };
}

export type RecordArgs = {
  date: string;
  distance?: number;
  arrows: (string | number)[];
};
