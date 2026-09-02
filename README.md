# 100554 · Collab Studio Core

Part of **collab.codes**.

`100554` is the **core of the Studio** — the application clients use to create,
edit, preview and test their projects. It is the largest frontend project in
`mls-base` (~350 `.ts` files) and everything else in the Studio hangs off it.

## What lives here

All source is flat under `l2/`, grouped by filename prefix:

| prefix | what it is |
|---|---|
| `collab*` (~55) | the Studio UI itself: editors, navigation, console, DOM sync, L3 text editing |
| `service*` (~22) | Studio services: projects, products, units, dashboards, previews, histories |
| `agent*` (~19) | agent panels and comparison/planner screens for the generation pipeline |
| `plugin*` (~18) | host side of the Studio plugins (the plugins themselves live in `100555`) |
| `widget*` (~11) | embedded widgets (mind map L4, code/text, etc.) |
| `driver*`, `preview*`, `enhancement*` | test drivers, preview modes and Lit enhancements |

`l3/assets/` holds the static media used by the Studio (coach marks, fonts,
video). `l5/project.json` declares three languages (en / pt / es) and the
Studio service list.

## Notes

- Not runnable standalone — it is published as part of the Studio environment.
- The Studio shell that loads it is [`102041`](../mls-102041); the plugin set is
  [`100555`](../mls-100555); shared libraries come from [`102027`](../mls-102027).
