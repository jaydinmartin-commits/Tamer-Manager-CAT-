/**
 * Pocket Familiar CAT integration.
 *
 * The Loot Tavern Tamer and its features are entered manually in Foundry.
 * CAT supports this: an item with no CAT source matches a registered
 * automation only when the registered UUID is that exact world item UUID.
 */

const SOURCE = "tamer-manager-cat";
const IDENTIFIER = "pocket-familiar";
const VERSION = "0.1.0";

/**
 * Identifies manually created Pocket Familiar feature items.
 */
export function isPocketFamiliarItem(item) {
  return item?.name?.trim().toLowerCase() === "pocket familiar";
}

/**
 * Finds Pocket Familiar items already embedded on world actors.
 */
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
 * Register one manually entered Pocket Familiar item with CAT.
 *
 * The item's own UUID is intentionally used. CAT's current matching contract
 * explicitly supports source-less world items by matching the registered UUID.
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
    type: item.type,
    config: {
      summons: {
        default: [],
        type: "selectSummons",
        category: "homebrew",
        label: "Pocket Familiar"
      },
      replaceExisting: {
        default: true,
        type: "checkbox",
        category: "behavior",
        label: "Replace Existing Familiar"
      }
    }
  });
}

/**
 * Register every manually entered Pocket Familiar currently present in the
 * world. New copies are registered when they are created or updated.
 */
export function registerPocketFamiliar() {
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
