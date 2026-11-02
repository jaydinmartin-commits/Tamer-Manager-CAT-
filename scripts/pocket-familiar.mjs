/**
 * Pocket Familiar CAT integration.
 *
 * The Loot Tavern Tamer and its features are entered manually in Foundry.
 * This module therefore discovers Pocket Familiar items on actors rather than
 * requiring a Loot Tavern compendium.
 *
 * CAT registration is intentionally kept separate from summon execution.
 * CAT's generic summon configuration contract is still being mapped against
 * the current source; no guessed flag paths are written to user items.
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

/**
 * Register a manually entered Pocket Familiar item with CAT.
 *
 * Registration uses the feature's real D&D5e identifier and its exact world
 * item UUID. No summon configuration is written here until the current CAT
 * generic configuration schema and invocation contract are verified.
 */
export function registerPocketFamiliarItem(item) {
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

  return api.registerAutomation({
    source: SOURCE,
    rules,
    identifier,
    version: VERSION,
    uuid: item.uuid,
    type: item.type
  });
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
      results.push(registerPocketFamiliarItem(item));
    }
  }

  globalThis.TamerCATAutomations ??= { features: {} };
  globalThis.TamerCATAutomations.features.pocketFamiliar = {
    identifier: IDENTIFIER,
    source: SOURCE,
    version: VERSION,
    isItem: isPocketFamiliarItem,
    findOnActor: findPocketFamiliarItems,
    registerItem: registerPocketFamiliarItem
  };

  console.log(`${SOURCE} | Registered ${results.filter(Boolean).length} manually entered Pocket Familiar item(s) with CAT.`);
  return results.every(Boolean);
}

export const pocketFamiliar = {
  source: SOURCE,
  identifier: IDENTIFIER,
  version: VERSION,
  isPocketFamiliarItem,
  findPocketFamiliarItems,
  registerPocketFamiliarItem
};
