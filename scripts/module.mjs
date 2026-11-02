/**
 * Tamer CAT Automations
 *
 * The Loot Tavern Tamer class and its features are entered manually by the
 * user. This module discovers those feature items on world actors and never
 * depends on a Loot Tavern compendium UUID.
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

  Hooks.on("createItem", async item => {
    if (globalThis.cat?.api && isPocketFamiliarItem(item)) {
      await registerPocketFamiliarItem(item);
    }
  });

  Hooks.on("updateItem", async item => {
    if (globalThis.cat?.api && isPocketFamiliarItem(item)) {
      await registerPocketFamiliarItem(item);
    }
  });
});

// CAT's public API is available at init, but catReady runs after CAT has
// finished loading its generic macros and automation infrastructure.
Hooks.once("catReady", async () => {
  globalThis.TamerCATAutomations.cat = globalThis.cat;

  globalThis.cat.api.registerSourceName?.(
    MODULE_ID,
    game.modules.get(MODULE_ID)?.title ?? "Tamer CAT Automations"
  );

  globalThis.TamerCATAutomations.features.pocketFamiliar = {
    register: registerPocketFamiliar,
    registerItem: registerPocketFamiliarItem
  };

  await registerPocketFamiliar();

  console.log(`${MODULE_ID} | CAT ready; Pocket Familiar is prepared to use CAT's native summon generic.`);
});
