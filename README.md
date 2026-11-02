# Tamer CAT Automations

A separate CAT-based automation project for Loot Tavern's Tamer class. The Tamer class and feature items are entered manually by the user; this module does not require a Loot Tavern compendium UUID.

## Pocket Familiar — Homebrew configuration

The Pocket Familiar automation registers a dedicated **Homebrew** section in CAT's Configuration tab with:

- **Summon Activity** — selects the Pocket Familiar item activity that triggers the summon.
- **Companion Profiles** — selects one or more creature actors, including actors chosen from a compendium.
- **Placement Range** — sets the placement distance in feet.
- **Replace Existing Familiar** — controls whether a previous familiar created by this item is dismissed before a replacement is created.

These values are synchronized into CAT's native `cat|summon` generic configuration. CAT remains responsible for summon creation, placement, source tracking, and dismissal. The Generic Automations tab remains available as CAT's native configuration surface.

## Current limitations

This milestone establishes the configuration UI and its handoff to CAT's native summon generic. The complete summon flow still requires in-world verification, including actor selection persistence, correct activity matching, placement range, and replacement behavior. Do not treat the feature as production-ready until those tests pass.

## Test environment

- Foundry VTT v14
- D&D5e v6.x
- Covens Automation Toolkit (CAT)
- Midi-QOL where required by CAT

## Project isolation

This repository is separate from the defunct Tamer Manager project and does not modify or depend on it.
