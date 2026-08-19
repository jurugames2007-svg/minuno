import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { makeChart, judgeDelta, judgeScore } from "./fnf";
import { bossForLevel } from "../art/Bosses";
import { BOSS_GENRE } from "../data/bossModes";
import { spellForBoss } from "../data/spells";
import { moodPose, stageFor } from "../data/cinematics";

describe("fnf chart", () => {
  it("genera notas de jugador y enemigo", () => {
    const c = makeChart(8, 132);
    assert.ok(c.length > 20);
    assert.ok(c.some((n) => n.side === "p"));
    assert.ok(c.some((n) => n.side === "e"));
    assert.ok(c.every((n) => n.lane >= 0 && n.lane <= 3));
    const times = c.map((n) => n.t);
    assert.deepEqual(times, [...times].sort((a, b) => a - b));
  });
  it("es determinista", () => {
    assert.deepEqual(makeChart(4, 120), makeChart(4, 120));
  });
});

describe("fnf judge", () => {
  it("sick / good / bad / miss por ventana", () => {
    assert.equal(judgeDelta(0), "sick");
    assert.equal(judgeDelta(18), "sick");
    assert.equal(judgeDelta(19), "good");
    assert.equal(judgeDelta(36), "good");
    assert.equal(judgeDelta(37), "bad");
    assert.equal(judgeDelta(55), "miss");
    assert.equal(judgeScore("sick"), 2);
    assert.equal(judgeScore("good"), 1);
    assert.equal(judgeScore("bad"), 0);
    assert.equal(judgeScore("miss"), 0);
  });
});

describe("boss roster", () => {
  it("niveles 1-20 cubren 20 géneros y cierran con Bigotes", () => {
    const types = Array.from({ length: 20 }, (_, i) => bossForLevel(i + 1));
    assert.equal(types[0], "escoba");
    assert.equal(BOSS_GENRE[types[0]], "tiles");
    assert.equal(types[19], "bigotes");
    assert.equal(BOSS_GENRE.bigotes, "final");
    assert.equal(bossForLevel(40), "bigotes");
    assert.equal(bossForLevel(0), "escoba");
    const genres = types.map((t) => BOSS_GENRE[t]);
    assert.equal(new Set(genres).size, 20);
  });
  it("cada tipo tiene género y hechizo", () => {
    const all = Object.keys(BOSS_GENRE) as (keyof typeof BOSS_GENRE)[];
    for (const t of all) {
      assert.ok(BOSS_GENRE[t]);
      assert.ok(spellForBoss(t));
    }
  });
  it("hechizos de los 10 originales no caen al default salvo escoba", () => {
    assert.equal(spellForBoss("escoba"), "barrido");
    assert.equal(spellForBoss("gato"), "arcoiris");
    assert.equal(spellForBoss("bigotes"), "ladrido");
    assert.equal(spellForBoss("vacuum"), "barrido");
  });
});

describe("cinematics", () => {
  it("stageFor tiene fallback y poses útiles", () => {
    assert.equal(stageFor("escoba").place.length > 0, true);
    assert.ok(stageFor("vacuum").intro.length >= 1);
    assert.equal(moodPose("scared"), "hurt");
    assert.equal(moodPose("brave"), "win");
    assert.equal(moodPose("curious"), "idle");
  });
});
