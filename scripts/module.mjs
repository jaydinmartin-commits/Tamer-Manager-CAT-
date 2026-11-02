/**
 * Tamer CAT Automations
 * Milestone 0.1 bootstrap.
 *
 * The Loot Tavern Tamer class is entered manually by the user. This module
 * therefore never relies on a hard-coded class or compendium UUID.
 * Feature discovery starts from items already present on the actor.
 */

import { registerPocketFamiliar } from "./pocket-familiar.mjs";

const MODULE_ID = "tamer-manager-cat";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Tamer CAT Automations`);

  globalThis.TamerCATAutomations = {
    id: MODULE_ID,
    version: game.modules.get(MODULE_ID)?.version ?? "unknown",
    features: {}
  };
});

Hooks.once("ready", () => {
  const catModule = game.modules.get("cat");

  if (!catModule?.active) {
    ui.notifications?.warn("Tamer CAT Automations requires CAT to be enabled.");
    return;
  }

  if (!globalThis.cat?.api) {
    ui.notifications?.warn("Tamer CAT Automations could not find the CAT API.");
    return;
  }

  globalThis.TamerCATAutomations.cat = globalThis.cat;

  // Pocket Familiar is discovered from the manually entered class feature.
  // No Loot Tavern compendium UUID is assumed.
  globalThis.TamerCATAutomations.features.pocketFamiliar = {
    register: registerPocketFamiliar
  };

  registerPocketFamiliar();

  console.log(`${MODULE_ID} | CAT detected; Pocket Familiar integration bootstrap ready.`);
});
