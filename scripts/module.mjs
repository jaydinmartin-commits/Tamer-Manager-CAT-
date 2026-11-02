/**
 * Tamer CAT Automations
 * Milestone 0.1 bootstrap.
 *
 * This module intentionally does not replace CAT's summon system.
 * Pocket Familiar will integrate with globalThis.cat.api after the
 * CAT registration contract is verified against the current release.
 */

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
  console.log(`${MODULE_ID} | CAT detected; Pocket Familiar integration bootstrap ready.`);
});
