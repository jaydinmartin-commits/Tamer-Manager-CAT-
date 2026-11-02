/**
 * Tamer CAT Automations
 *
 * The Loot Tavern Tamer class and its features are entered manually by the
 * user. This module therefore discovers feature items already on world actors
 * and never depends on a Loot Tavern compendium UUID.
 */

import {
  isPocketFamiliarItem,
  registerPocketFamiliar,
  registerPocketFamiliarItem
} from "./pocket-familiar.mjs";

const MODULE_ID = "tamer-manager-cat";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Tamer CAT Automations`);

  globalThis.TamerCATAutomations = {
    id: MODULE_ID,
    version: game.modules.get(MODULE_ID)?.version ?? "unknown",
    features: {}
  };

  Hooks.on("createItem", item => {
    if (globalThis.cat?.api && isPocketFamiliarItem(item)) {
      registerPocketFamiliarItem(item);
    }
  });

  Hooks.on("updateItem", item => {
    if (globalThis.cat?.api && isPocketFamiliarItem(item)) {
      registerPocketFamiliarItem(item);
    }
  });
});

// CAT exposes its completed automation registry through catReady.
Hooks.once("catReady", () => {
  globalThis.TamerCATAutomations.cat = globalThis.cat;

  globalThis.TamerCATAutomations.features.pocketFamiliar = {
    register: registerPocketFamiliar,
    registerItem: registerPocketFamiliarItem
  };

  registerPocketFamiliar();

  console.log(`${MODULE_ID} | CAT ready; Pocket Familiar items registered for CAT Shield configuration.`);
});
