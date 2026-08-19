import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { makeChart, judgeDelta, judgeScore } from "./fnf";
import { bossForLevel, spawnBoss, type BossType } from "../art/Bosses";
import { BOSS_GENRE, GENRE } from "../data/bossModes";
import { spellForBoss, SPELLS, SPELL_MAP } from "../data/spells";
import { moodPose, stageFor, maxineIntroKind } from "../data/cinematics";
import {
  SKINS, SKIN_MAP, CATEGORIES, BODY_TRANSFORM, isBodyTransform,
  canBuySkin, isHiddenUntilOwned, isUglyLocked, visibleShopSkins, type SkinId,
} from "../data/skins";
import { FIELD_SECRETS, SECRET_SKIN_IDS } from "../data/secrets";
import { CYCLE, COLS, GATE_H, LEVEL_LEN, REST_H, TILE } from "../data/world";
import {
  CHARGE_KEYS, DASH_KEYS, DANCE_SEQ, DANCE_BEAT, ENEMY_TYPES,
  cycleLength, rowOfLevel, uniqueGenres, enemyPeriod, cineLineCount,
  isChargeKey, isDashKey,
} from "./rules";

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
  it("es determinista y más denso que un pulso simple", () => {
    assert.deepEqual(makeChart(4, 120), makeChart(4, 120));
    const c = makeChart(4, 120);
    assert.ok(c.filter((n) => n.side === "p").length >= 16);
  });
});

describe("fnf judge", () => {
  it("sick / good / bad / miss por ventana", () => {
    assert.equal(judgeDelta(0), "sick");
    assert.equal(judgeDelta(18), "sick");
    assert.equal(judgeDelta(19), "good");
    assert.equal(judgeDelta(36), "good");
    assert.equal(judgeDelta(37), "bad");
    assert.equal(judgeDelta(54), "bad");
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
    assert.equal(uniqueGenres(types).length, 20);
  });
  it("cada tipo tiene género, hechizo y spawn con hp", () => {
    const all = Object.keys(BOSS_GENRE) as BossType[];
    for (const t of all) {
      assert.ok(BOSS_GENRE[t]);
      assert.ok(GENRE[BOSS_GENRE[t]]);
      assert.ok(spellForBoss(t));
      const b = spawnBoss(t, 5, 40, 320, 80);
      assert.equal(b.type, t);
      assert.ok(b.maxHp >= 6);
      assert.equal(b.hp, b.maxHp);
    }
  });
  it("hechizos de los 10 originales no caen al default salvo escoba", () => {
    assert.equal(spellForBoss("escoba"), "barrido");
    assert.equal(spellForBoss("gato"), "arcoiris");
    assert.equal(spellForBoss("bigotes"), "ladrido");
    assert.equal(spellForBoss("vacuum"), "barrido");
    assert.equal(SPELLS.length, Object.keys(SPELL_MAP).length);
  });
});

describe("cinematics", () => {
  it("stageFor tiene fallback y poses útiles", () => {
    assert.equal(stageFor("escoba").place.length > 0, true);
    assert.ok(stageFor("vacuum").intro.length >= 1);
    assert.equal(moodPose("scared"), "hurt");
    assert.equal(moodPose("brave"), "win");
    assert.equal(moodPose("curious"), "idle");
    assert.equal(cineLineCount(stageFor("escoba").intro, stageFor("escoba").react), 3);
  });
  it("intros de las pieles nuevas", () => {
    assert.equal(maxineIntroKind("cthulhu"), "fade");
    assert.equal(maxineIntroKind("pennywise"), "spin");
    assert.equal(maxineIntroKind("juana"), "sparkle");
    assert.equal(maxineIntroKind("bodoque"), "dash");
    assert.equal(maxineIntroKind("huachimingo"), "sparkle");
  });
});

describe("skins", () => {
  it("ids únicos y mapa completo", () => {
    const ids = SKINS.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const s of SKINS) assert.equal(SKIN_MAP[s.id].name, s.name);
  });
  it("incluye Cthulhu, Pennywise, Bodoque, Juana y Huachimingo mítico", () => {
    const need: SkinId[] = ["cthulhu", "pennywise", "bodoque", "juana", "huachimingo"];
    for (const id of need) {
      assert.ok(SKIN_MAP[id], id);
      assert.ok(SKIN_MAP[id].name.length > 2);
    }
    assert.equal(SKIN_MAP.bodoque.category, "31 Minutos");
    assert.equal(SKIN_MAP.juana.category, "31 Minutos");
    assert.match(SKIN_MAP.juana.blurb.toLowerCase(), /rosa/);
    assert.equal(SKIN_MAP.cthulhu.category, "Horror");
    assert.equal(SKIN_MAP.pennywise.category, "Horror");
    assert.equal(SKIN_MAP.huachimingo.rarity, "Mítica");
    assert.equal(SKIN_MAP.huachimingo.category, "Mítica");
    assert.ok(SKIN_MAP.huachimingo.price > SKIN_MAP.yarnaby.price);
    assert.ok(CATEGORIES.includes("Horror"));
    assert.ok(CATEGORIES.includes("31 Minutos"));
    assert.ok(CATEGORIES.includes("Mítica"));
  });
  it("Cthulhu/Bodoque/Juana/Huachimingo transforman el cuerpo; Pennywise es disfraz", () => {
    assert.equal(isBodyTransform("cthulhu"), true);
    assert.equal(isBodyTransform("bodoque"), true);
    assert.equal(isBodyTransform("juana"), true);
    assert.equal(isBodyTransform("huachimingo"), true);
    assert.equal(isBodyTransform("pennywise"), false);
    assert.equal(isBodyTransform("default"), false);
    assert.ok(BODY_TRANSFORM.includes("cthulhu"));
  });
  it("secretas ocultas y Bigotes no se compra", () => {
    const hada = SKIN_MAP.hada;
    assert.equal(isHiddenUntilOwned(hada, ["default"]), true);
    assert.equal(isHiddenUntilOwned(hada, ["hada"]), false);
    assert.ok(!visibleShopSkins(["default"]).some((s) => s.id === "hada"));
    assert.ok(visibleShopSkins(["hada"]).some((s) => s.id === "hada"));
    const ugly = SKIN_MAP.bigotes;
    assert.equal(isUglyLocked(ugly, ["default"], false), true);
    assert.equal(canBuySkin(ugly, ["default"], 9999, false), false);
    assert.equal(canBuySkin(SKIN_MAP.cthulhu, ["default"], 50, false), false);
    assert.equal(canBuySkin(SKIN_MAP.cthulhu, ["default"], 2000, false), true);
    assert.equal(canBuySkin(SKIN_MAP.default, ["default"], 0, false), false);
  });
  it("secretos de campo apuntan a pieles reales", () => {
    for (const id of SECRET_SKIN_IDS) assert.ok(SKIN_MAP[id]);
    assert.ok(FIELD_SECRETS.length >= 4);
  });
});

describe("world + combate", () => {
  it("CYCLE cuadra con piezas de nivel", () => {
    assert.equal(CYCLE, cycleLength());
    assert.equal(CYCLE, LEVEL_LEN + GATE_H + REST_H + 2);
    assert.equal(COLS, 8);
    assert.equal(TILE, 45);
    assert.equal(rowOfLevel(1), 3);
    assert.equal(rowOfLevel(2), 3 + CYCLE);
  });
  it("teclas de carga y dash no se pisan", () => {
    assert.ok(isChargeKey("j"));
    assert.ok(isDashKey("Shift"));
    assert.ok(isDashKey("k"));
    assert.equal(isChargeKey("Shift"), false);
    assert.equal(isDashKey("j"), false);
    for (const k of CHARGE_KEYS) assert.equal(DASH_KEYS.includes(k as never), false);
  });
  it("baile usa patrón fijo distinto de FNF aleatorio", () => {
    assert.equal(DANCE_BEAT, 0.5);
    assert.ok(DANCE_SEQ.every((n) => n >= 0 && n <= 3));
    assert.ok(new Set(DANCE_SEQ).size === 4);
  });
  it("cinco enemigos de torre con ritmos distintos", () => {
    assert.equal(ENEMY_TYPES.length, 5);
    const periods = ENEMY_TYPES.map(enemyPeriod);
    assert.equal(new Set(periods).size, 5);
  });
});
