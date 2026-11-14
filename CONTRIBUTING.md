# Adding a term

A new guide has to pass one test: a parent is reasonably likely to see this exact word from a kid or teen this year, and would misunderstand the message without help. Safety, drugs, sex, self-harm, money, and harassment count. Ordinary English, standard abbreviations, standard emoji, and game-menu labels do not.

Before you add a page:

- One idea gets one page. Extra spellings and cruder synonyms go in `aliases` or `app/src/termAliases.ts`. Opposites are not aliases. Neighboring roles (sugar baby versus a sugar-daddy DM, proship versus anti-ship, W versus L, cap versus no cap) are not aliases.
- If the headword is also normal English, the first sentence is the common reading. The dangerous reading comes second. Do not hang a street-name thesaurus on the ordinary word.
- The concern badge matches the typical use. A phrase that is usually dinner is harmless, with a footnote. An opioid is not filed next to a party being fun.
- Safety pages name the harm and what to do. They do not include doses, recipes, or how to run a scam or a betting slip.
- Filter dodges kids use right now belong. A challenge that survives only in parent articles does not.
- Clinical words have to say when teens are using them loosely.
- An alias that is a single letter or an ordinary word may be searchable. Add it to `decodeSkipAliases` so a pasted message never lights up the guide. The head term of an existing short guide still matches.
- Run `npm run build` in `app/` before you open a pull request.
