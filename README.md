# Tamer CAT Automations

A separate CAT-based automation project for Loot Tavern's Tamer class.

## Milestone 0.1: Pocket Familiar

The first milestone is intentionally narrow:

1. Detect and validate CAT.
2. Establish a stable module namespace.
3. Map Pocket Familiar onto CAT's existing summon infrastructure.
4. Add CAT-native configuration and familiar selection only after the current CAT registration/configuration contract is verified.

This project does **not** depend on or modify the defunct Tamer Manager project.

## Current status

The initial installable module scaffold is in place. The next implementation step is to wire Pocket Familiar into CAT's verified external automation registration pattern and then add the familiar source configuration.

## Test environment

- Foundry VTT v14
- D&D5e v6.x
- CAT
- Midi-QOL where required by CAT
