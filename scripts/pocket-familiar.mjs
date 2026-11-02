/**
 * Pocket Familiar CAT integration.
 *
 * Milestone 0.1 keeps CAT registration separate from execution logic.
 */

const SOURCE = "tamer-manager-cat";
const IDENTIFIER = "pocket-familiar";
const RULES = "2024";

export function registerPocketFamiliar() {
  const api = globalThis.cat?.api;
  if (!api?.registerAutomation) {
    console.warn(`${SOURCE} | CAT automation API is unavailable; Pocket Familiar was not registered.`);
    return false;
  }

  console.log(`${SOURCE} | Pocket Familiar integration ready for item binding.`);
  return true;
}

export const pocketFamiliar = { source: SOURCE, identifier: IDENTIFIER, rules: RULES };
