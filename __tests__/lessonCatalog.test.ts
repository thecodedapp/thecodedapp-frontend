/// <reference types="jest" />

import {
  BUILT_LESSON_NUMBERS,
  getLessonById,
  getLessonByNumber,
} from "../lib/lessonCatalog";

const lessonCases: Array<[number, string, string]> = [
  [1, "what-is-code", "What is Code?"],
  [2, "how-computers-think", "How Computers Think"],
  [3, "what-can-you-build", "What Can You Build?"],
  [4, "programming-languages", "Programming Languages"],
  [5, "build-a-project", "Build a Project"],
];

describe("lesson catalog", () => {
  it("contains the full five-lesson intro path", () => {
    expect(BUILT_LESSON_NUMBERS).toEqual([1, 2, 3, 4, 5]);
  });

  it.each(lessonCases)("maps lesson %i to %s", (number, id, title) => {
    const lesson = getLessonByNumber(number);

    expect(lesson?.id).toBe(id);
    expect(lesson?.title).toBe(title);
    expect(lesson?.steps.length).toBeGreaterThan(1);
    expect(getLessonById(id)?.number).toBe(number);
  });

  it("keeps future lessons out of the built catalog safeguard", () => {
    expect(getLessonByNumber(6)).toBeUndefined();
  });
});
