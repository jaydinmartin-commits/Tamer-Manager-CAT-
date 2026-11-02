/**
 * Pocket Familiar CAT integration.
 *
 * The Loot Tavern Tamer and its features are entered manually in Foundry.
 * CAT's native summon generic performs all summon creation, replacement,
 * placement, and source tracking. The automation's Homebrew configuration
 * is the user-facing source of truth for the Pocket Familiar summon setup;
 * its values are synchronized into CAT's native generic summon flags.
 */

const SOURCE = "tamer-manager-cat";
const IDENTIFIER = "pocket-familiar";
const VERSION = "0.2.0";

const CONFIG = {
  summonActivity: {
    default: "",
    type: "selectActivity",
    category: "homebrew",
    label: "Summon Activity",
    hint: "The item activity that triggers the Pocket Familiar summon."
  },
  companions: {
    default: [],
    type: "selectSummons",
    category: "homebrew",
    label: "Companion Profiles",
    hint: "Choose the creature actor or actors CAT should create when this activity is used."
  },
  placementRange: {
    default: 30,
    type: "number",
    category: "homebrew",
    label: "Placement Range",
    hint: "Maximum distance from the summoner for placing the companion, in feet."
  },
  replaceExisting: {
    default: true,
    type: "checkbox",
    category: "homebrew",
    label: "Replace Existing Familiar",
    hint: "Dismiss a companion created by this Pocket Familiar before creating its replacement."
  }
};

export function isPocketFamiliarItem(item) {
  return item?.name?.trim().toLowerCase() === "pocket familiar";
}

export function findPocketFamiliarItems(actor) {
  return actor?.items?.filter(isPocketFamiliarItem) ?? [];
}

function getRules(item) {
  return item?.system?.source?.rules;
}

function getIdentifier(item) {
  return item?.system?.identifier;
}

function getFirstActivityId(item) {
  return item?.system?.activities?.contents?.[0]?.id
    ?? Object.values(item?.system?.activities ?? {})[0]?.id
    ?? "";
}

function getHomebrewConfig(item) {
  return item?.flags?.cat?.config ?? {};
}

function getAutomationConfig(item) {
  return {
    ...CONFIG,
    summonActivity: {
      ...CONFIG.summonActivity,
      default: getFirstActivityId(item)
    }
  };
}

/**
 * Attach CAT's native summon generic and synchronize the Pocket Familiar
 * Homebrew settings into the generic configuration consumed by CAT.
 *
 * Existing generic settings are retained unless the corresponding Homebrew
 * setting has been explicitly saved on the item.
 */
export async function prepareSummonGeneric(item) {
  if (!item?.setFlag) return false;

  const existing = item.flags?.cat?.genericConfig?.cat?.summon ?? {};
  const homebrew = getHomebrewConfig(item);
  const defaults = {
    activityId: getFirstActivityId(item),
    summons: [],
    range: 30,
    replaceExisting: true
  };

  const merged = {
    ...defaults,
    ...existing,
    activityId: homebrew.summonActivity
      || existing.activityId
      || getFirstActivityId(item),
    summons: Array.isArray(homebrew.companions)
      ? homebrew.companions
      : (existing.summons ?? []),
    range: homebrew.placementRange ?? existing.range ?? defaults.range,
    replaceExisting: homebrew.replaceExisting
      ?? existing.replaceExisting
      ?? defaults.replaceExisting
  };

  if (JSON.stringify(existing) === JSON.stringify(merged)) return true;

  await item.setFlag("cat", "genericConfig.cat.summon", merged);
  return true;
}

/**
 * Register a manually entered Pocket Familiar item with CAT and expose its
 * dedicated Homebrew configuration in CAT's Configuration tab.
 */
export async function registerPocketFamiliarItem(item) {
  const api = globalThis.cat?.api;
  if (!api?.registerAutomation || !isPocketFamiliarItem(item)) return false;

  const rules = getRules(item);
  const identifier = getIdentifier(item);

  if (!rules || !identifier) {
    console.warn(
      `${SOURCE} | Pocket Familiar on ${item.actor?.name ?? "unknown actor"} requires a D&D5e item identifier and rules edition before CAT can register it.`
    );
    return false;
  }

  const config = getAutomationConfig(item);
  const registered = api.registerAutomation({
    source: SOURCE,
    rules,
    identifier,
    version: VERSION,
    uuid: item.uuid,
    type: item.type,
    config
  });

  if (registered) await prepareSummonGeneric(item);
  return registered;
}

export async function registerPocketFamiliar() {
  const api = globalThis.cat?.api;
  if (!api?.registerAutomation) {
    console.warn(`${SOURCE} | CAT automation API is unavailable; Pocket Familiar was not registered.`);
    return false;
  }

  const results = [];
  for (const actor of game.actors ?? []) {
    for (const item of findPocketFamiliarItems(actor)) {
      results.push(await registerPocketFamiliarItem(item));
    }
  }

  globalThis.TamerCATAutomations ??= { features: {} };
  globalThis.TamerCATAutomations.features.pocketFamiliar = {
    identifier: IDENTIFIER,
    source: SOURCE,
    version: VERSION,
    generic: {source: "cat", identifier: "summon"},
    config: CONFIG,
    isItem: isPocketFamiliarItem,
    findOnActor: findPocketFamiliarItems,
    registerItem: registerPocketFamiliarItem,
    prepareSummonGeneric
  };

  console.log(`${SOURCE} | Registered ${results.filter(Boolean).length} manually entered Pocket Familiar item(s) with CAT.`);
  return results.every(Boolean);
}

export const pocketFamiliar = {
  source: SOURCE,
  identifier: IDENTIFIER,
  version: VERSION,
  generic: {source: "cat", identifier: "summon"},
  config: CONFIG,
  isPocketFamiliarItem,
  findPocketFamiliarItems,
  registerPocketFamiliarItem,
  prepareSummonGeneric
};
