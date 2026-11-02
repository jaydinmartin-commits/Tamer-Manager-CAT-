/**
 * Pocket Familiar CAT integration.
 *
 * The Loot Tavern Tamer and its features are entered manually in Foundry.
 * Each world-created Pocket Familiar is registered against its own UUID.
 *
 * Summoning is delegated to CAT's existing generic summon automation. This
 * module only discovers the feature, registers it with CAT, and prepares the
 * generic summon configuration on the manually entered item.
 */

const SOURCE = "tamer-manager-cat";
const IDENTIFIER = "pocket-familiar";
const VERSION = "0.1.0";
const GENERIC_SOURCE = "cat";
const GENERIC_IDENTIFIER = "summon";

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
    ?? item?.system?.activities?.[0]?.id;
}

/**
 * Prepare CAT's generic summon configuration without overwriting choices the
 * user has already made in CAT Shield.
 *
 * The empty summons list is intentional: CAT Shield's native selectSummons
 * control owns familiar-source selection. Once configured, CAT's summon
 * generic handles creation, replacement, placement, and tracking.
 */
export async function prepareSummonConfig(item) {
  if (!item?.update) return false;

  const existing = item.flags?.cat?.genericConfig?.[GENERIC_SOURCE]?.[GENERIC_IDENTIFIER] ?? {};
  const activityId = existing.activityId ?? getFirstActivityId(item);

  const defaults = {
    activityId: activityId ?? "",
    summons: existing.summons ?? [],
    range: existing.range ?? 30,
    replaceExisting: existing.replaceExisting ?? true
  };

  const changes = {};
  for (const [key, value] of Object.entries(defaults)) {
    if (existing[key] === undefined) {
      changes[`flags.cat.genericConfig.${GENERIC_SOURCE}.${GENERIC_IDENTIFIER}.${key}`] = value;
    }
  }

  if (!Object.keys(changes).length) return true;
  await item.update(changes);
  return true;
}

/**
 * Register one manually entered Pocket Familiar item with CAT.
 *
 * CAT's current matching contract supports source-less world items by
 * matching the registered UUID to the exact item UUID.
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

  if (registered) await prepareSummonConfig(item);
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
    generic: {source: GENERIC_SOURCE, identifier: GENERIC_IDENTIFIER},
    isItem: isPocketFamiliarItem,
    findOnActor: findPocketFamiliarItems,
    registerItem: registerPocketFamiliarItem,
    prepareSummonConfig
  };

  console.log(`${SOURCE} | Registered ${results.filter(Boolean).length} manually entered Pocket Familiar item(s) with CAT.`);
  return results.every(Boolean);
}

export const pocketFamiliar = {
  source: SOURCE,
  identifier: IDENTIFIER,
  version: VERSION,
  generic: {source: GENERIC_SOURCE, identifier: GENERIC_IDENTIFIER},
  isPocketFamiliarItem,
  findPocketFamiliarItems,
  registerPocketFamiliarItem,
  prepareSummonConfig
};
