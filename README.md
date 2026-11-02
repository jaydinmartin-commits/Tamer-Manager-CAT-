# Tamer CAT Automations

A separate CAT-based automation project for Loot Tavern's Tamer class.

## Milestone 0.1: Pocket Familiar

The first milestone is intentionally narrow:

1. Detect CAT and register manually entered Pocket Familiar feature items.
2. Prepare CAT's native generic summon configuration without replacing CAT's summon system.
3. Support the Tamer class being entered manually into Foundry.
4. Establish the configuration path before adding Tamer-specific familiar validation.

This project does **not** depend on or modify the defunct Tamer Manager project.

## Current test status

The module scaffold and CAT registration path are in place. **Do not test summoning yet.** The next implementation step is to verify the final CAT Shield configuration presentation and the invocation path into CAT's summon generic.

## Test environment

- Foundry VTT v14
- D&D5e v6.x
- CAT
- Midi-QOL where required by CAT

## When testing begins

The first requested test will be limited to installation, module loading, CAT detection, and recognition of a manually entered Pocket Familiar item. Summoning will be tested only after the configuration-to-generic-summon handoff is complete.
