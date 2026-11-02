/**
 * Pocket Familiar CAT integration.
 *
 * Milestone 0.1 deliberately supports world-created feature items. The
 * Tamer class and Pocket Familiar feature are entered manually, so this
 * module does not require a Loot Tavern compendium UUID.
 *
 * CAT registration remains isolated here until the current public
 * registration schema is verified against CAT's implementation.
 */

const SOURCE = "tamer-manager-cat";
const IDENTIFIER = "pocket-familiar";
const RULES = "2024";

/**
 * Identifies manually created Pocket Familiar feature items.
 *
 * We intentionally use a conservative name match for the first milestone.
 * Future versions can expose explicit item binding once the CAT Shield
 * binding contract is implemented.
 */
export function isPocketFamiliarItem(item) {
  if (!item) return false;

  return item.name?.trim().toLowerCase() === "pocket familiar";
}

/**
 * Returns Pocket Familiar feature items already present on an actor.
 * This works for manually entered classes and does not depend on a
 * compendium, source UUID, or imported package.
 */
export function findPocketFamiliarItems(actor) {
  if (!actor?.items) return [];

  return actor.items.filter(isPocketFamiliarItem);
}

export function registerPocketFamiliar() {
  const api = globalThis.cat?.api;
  if (!api?.registerAutomation) {
    console.warn(`${SOURCE} | CAT automation API is unavailable; Pocket Familiar was not registered.`);
    return false;
  }

  globalThis.TamerCATAutomations ??= { features: {} };
  globalThis.TamerCATAutomations.features.pocketFamiliar = {
    identifier: IDENTIFIER,
    source: SOURCE,
    rules: RULES,
    isItem: isPocketFamiliarItem,
    findOnActor: findPocketFamiliarItems
  };

  console.log(`${SOURCE} | Pocket Familiar integration ready for manually entered feature items.`);
  return true;
}

export const pocketFamiliar = {
  source: SOURCE,
  identifier: IDENTIFIER,
  rules: RULES,
  isPocketFamiliarItem,
  findPocketFamiliarItems
};
