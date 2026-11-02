/**
 * Pocket Familiar CAT integration.
 *
 * The Loot Tavern Tamer and its features are entered manually in Foundry.
 * CAT's native summon generic performs all summon creation, replacement,
 * placement, and source tracking.
 */

const SOURCE = "tamer-manager-cat";
const IDENTIFIER = "pocket-familiar";
const VERSION = "0.1.0";

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

/**
 * Attach CAT's verified native summon generic to the manually entered item.
 *
 * Generic configuration belongs on flags.cat.genericConfig.cat.summon.
 * We only provide missing defaults so CAT Shield remains the owner of the
 * user's summon selection and later configuration.
 */
export async function prepareSummonGeneric(item) {
  if (!item?.setFlag) return false;

  const existing = item.flags?.cat?.genericConfig?.cat?.summon ?? {};
  const defaults = {
    activityId: getFirstActivityId(item),
    summons: [],
    range: 30,
    replaceExisting: true
  };

  const merged = {...defaults, ...existing};
  if (JSON.stringify(existing) === JSON.stringify(merged)) return true;

  await item.setFlag("cat", "genericConfig.cat.summon", merged);
  return true;
}

/**
 * Register a manually entered Pocket Familiar item with CAT and prepare its
 * native generic summon configuration.
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

  const registered = api.registerAutomation({
    source: SOURCE,
    rules,
    identifier,
    version: VERSION,
    uuid: item.uuid,
    type: item.type
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
  isPocketFamiliarItem,
  findPocketFamiliarItems,
  registerPocketFamiliarItem,
  prepareSummonGeneric
};
