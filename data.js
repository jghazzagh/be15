/* ============================================================
   GAME DATA — Grammar on Trial
   Five cases, one per week (Weeks 1-5). Each case holds:
     - intro / outro  : dialogue beats (speaker + line)
     - challenges      : the playable questions
   Challenge types:
     mc    -> multiple choice. options:[{text, correct, fb}]
     sort  -> drag chips into buckets. buckets + items
     build -> drag words into the answer line in the right order
   Any challenge tagged hardOnly:true only appears on CEO difficulty.
   Speakers: buzz (mentor), max (chaos CEO), you (player), narrator.
   ============================================================ */

const SPEAKERS = {
  buzz: "Buzz Wordsmith",
  max: "Max Chaos",
  you: "You",
  narrator: "Bizarre Bites Inc."
};

const CASES = [
  /* ========================================================
     CASE 1 — WEEK 1: Subjects, verbs, complete sentences
  ======================================================== */
  {
    id: 1,
    week: 1,
    title: "The Missing Subject",
    skill: "Week 1 · Subjects, verbs, and complete sentences",
    badge: "Intern",
    intro: [
      { speaker: "buzz", text: "Welcome to Bizarre Bites Communications. I am Buzz Wordsmith, Director of Comms. You are my new intern. Try not to start any fires." },
      { speaker: "max", text: "BUZZ. The Dragon Jerky launch note went out and nobody understood it. Half the words were missing the point. FIX IT." },
      { speaker: "buzz", text: "A complete sentence needs three things: a subject (who or what), a verb (the action), and a complete thought. Lose one, and the reader is lost too." },
      { speaker: "you", text: "Got it. Show me the broken notes." }
    ],
    challenges: [
      {
        type: "mc",
        q: "Max sent four lines to the team. Which one is a COMPLETE sentence?",
        hint: "Look for a subject (who or what) AND a verb (the action). It must make sense on its own.",
        options: [
          { text: "The marketing team approved the jerky.", correct: true,
            fb: "Yes. Subject (the marketing team) plus verb (approved) plus a complete thought. It stands on its own." },
          { text: "Approved the jerky on Friday.", correct: false,
            fb: "No subject. Who approved it? This is a fragment, not a full sentence." },
          { text: "The marketing team and the long meeting about the jerky.", correct: false,
            fb: "There is a subject but no verb and no complete thought. Nothing happens. Fragment." },
          { text: "Because the jerky was too spicy.", correct: false,
            fb: "This starts with 'because,' so it cannot stand alone. It needs a main idea to finish the thought." }
        ]
      },
      {
        type: "sort",
        q: "Sort these into the right bin. Is each one a full sentence or a fragment?",
        instructions: "Drag each card into a bin. Or tap a card, then tap a bin.",
        hint: "A full sentence has a subject AND a verb AND finishes the thought. A fragment is missing a piece.",
        buckets: [
          { id: "complete", label: "Complete Sentence", kind: "good" },
          { id: "fragment", label: "Fragment", kind: "bad" }
        ],
        items: [
          { text: "Operations shipped the order.", bucket: "complete",
            fb: "Subject + verb + complete thought. Complete." },
          { text: "Running to the loading dock.", bucket: "fragment",
            fb: "No subject. Who is running? Fragment." },
          { text: "Sales rose fast.", bucket: "complete",
            fb: "Short but complete: subject (sales), verb (rose), full thought." },
          { text: "The neon soup in aisle four.", bucket: "fragment",
            fb: "A thing, but no verb. Nothing happens. Fragment." }
        ]
      },
      {
        type: "build",
        q: "Build one clear sentence for the launch note. Put the words in order.",
        instructions: "Drag the words into the box in the right order. Or tap each word to add it.",
        hint: "Start with the subject (who), then the verb (did what), then the rest. Begin with 'The'.",
        chips: ["the", "today", "team", "launched", "Dragon Jerky"],
        answer: ["the", "team", "launched", "Dragon Jerky", "today"],
        fb: "Clean: 'The team launched Dragon Jerky today.' Subject, verb, complete thought, done."
      },
      {
        type: "mc",
        hardOnly: true,
        q: "Expert check. In this sentence, which word is the VERB? 'The kitchen crew tasted the glowing pretzel.'",
        hint: "The verb is the action. What did the crew DO?",
        options: [
          { text: "tasted", correct: true, fb: "Correct. 'Tasted' is the action the crew performed." },
          { text: "crew", correct: false, fb: "'Crew' is part of the subject, not the action." },
          { text: "pretzel", correct: false, fb: "'Pretzel' is the thing being tasted, not the action." },
          { text: "glowing", correct: false, fb: "'Glowing' describes the pretzel. It is a describing word, not the main verb here." }
        ]
      }
    ],
    outro: [
      { speaker: "max", text: "It reads like a real company now. Suspicious. I like it." },
      { speaker: "buzz", text: "Badge earned: Intern. You can tell a sentence from a fragment. Now the hard part starts." }
    ]
  },

  /* ========================================================
     CASE 2 — WEEK 2: Fragments and run-ons
  ======================================================== */
  {
    id: 2,
    week: 2,
    title: "The Runaway Train",
    skill: "Week 2 · Run-ons and comma splices",
    badge: "Sentence Wrangler",
    intro: [
      { speaker: "narrator", text: "Day three. The Spicy-Ice Sushi memo arrives. It is one sentence. It is 90 words long. It has no brakes." },
      { speaker: "buzz", text: "This is a run-on. Two or more complete sentences crammed together with no real stop. Readers fall off the train." },
      { speaker: "buzz", text: "You can fix a run-on three ways: a period, a semicolon, or a comma plus a connector word like 'and' or 'but'." },
      { speaker: "you", text: "Let me grab the emergency brake." }
    ],
    challenges: [
      {
        type: "mc",
        q: "Which line is a run-on sentence?",
        hint: "A run-on jams two complete sentences together with no period, semicolon, or connector.",
        options: [
          { text: "The freezer broke we lost the sushi.", correct: true,
            fb: "Run-on. Two full sentences ('The freezer broke' and 'we lost the sushi') with nothing between them." },
          { text: "The freezer broke, so we lost the sushi.", correct: false,
            fb: "This is correct. A comma plus 'so' joins the two ideas properly." },
          { text: "When the freezer broke, we lost the sushi.", correct: false,
            fb: "Correct sentence. 'When the freezer broke' sets up the main idea that follows." },
          { text: "The freezer broke.", correct: false,
            fb: "Just one complete sentence. Not a run-on." }
        ]
      },
      {
        type: "mc",
        q: "Max wrote: 'We need the report now the client is waiting.' What is the best fix?",
        hint: "Two complete ideas are stuck together. You need a real stop or a connector between them.",
        options: [
          { text: "We need the report now; the client is waiting.", correct: true,
            fb: "A semicolon joins two related complete ideas. Clean and professional." },
          { text: "We need the report now, the client is waiting.", correct: false,
            fb: "Just a comma between two full sentences is a comma splice. Still broken." },
          { text: "We need the report now the client, is waiting.", correct: false,
            fb: "That comma lands in the wrong spot and fixes nothing." },
          { text: "We need the report now and now the client is waiting.", correct: false,
            fb: "Adding 'and now' is wordy and repeats 'now.' It does not fix the run-on cleanly." }
        ]
      },
      {
        type: "sort",
        q: "Sort each line. Is it a clean sentence or a run-on?",
        instructions: "Drag each card to a bin, or tap a card then tap a bin.",
        hint: "Read it out loud. If two full sentences smash together with no stop, it is a run-on.",
        buckets: [
          { id: "clean", label: "Clean Sentence", kind: "good" },
          { id: "runon", label: "Run-On", kind: "bad" }
        ],
        items: [
          { text: "The label printed wrong, so we reordered it.", bucket: "clean",
            fb: "Comma plus 'so' joins the ideas. Clean." },
          { text: "The truck is late the driver took a wrong turn.", bucket: "runon",
            fb: "Two full sentences, no stop between them. Run-on." },
          { text: "Sales jumped after the ad ran.", bucket: "clean",
            fb: "One complete idea. Clean." },
          { text: "I checked the order it looked fine.", bucket: "runon",
            fb: "'I checked the order' and 'it looked fine' both stand alone. Needs a period or connector. Run-on." }
        ]
      },
      {
        type: "mc",
        hardOnly: true,
        q: "Expert check. Which sentence has a COMMA SPLICE (the sneaky run-on)?",
        hint: "A comma splice uses only a comma to join two complete sentences. A comma alone is not strong enough.",
        options: [
          { text: "The oven beeped, the pretzels were ready.", correct: true,
            fb: "Comma splice. Two full sentences joined by only a comma. Use a period, semicolon, or add 'and'." },
          { text: "The oven beeped, and the pretzels were ready.", correct: false,
            fb: "Correct. The comma plus 'and' does the job." },
          { text: "When the oven beeped, the pretzels were ready.", correct: false,
            fb: "Correct. The first part sets up the main idea." },
          { text: "The oven beeped loudly.", correct: false,
            fb: "One complete idea. No splice." }
        ]
      }
    ],
    outro: [
      { speaker: "buzz", text: "Brakes installed. The memo no longer reads like a panic attack." },
      { speaker: "max", text: "Badge: Sentence Wrangler. You stopped the train. Onward, before something melts." }
    ]
  },

  /* ========================================================
     CASE 3 — WEEK 3: Audience, purpose, capitalization, end marks
  ======================================================== */
  {
    id: 3,
    week: 3,
    title: "Read the Room",
    skill: "Week 3 · Audience, tone, capitalization, end marks",
    badge: "Comms Cadet",
    intro: [
      { speaker: "narrator", text: "A new account: Frostbite Foods wants to buy 10,000 units of Nitro-Nacho Puffs. The first reply matters." },
      { speaker: "buzz", text: "Before you write, ask: who is reading this, and why? A note to your buddy and a note to a client are not the same animal." },
      { speaker: "buzz", text: "While you are at it: capital letters start sentences and name specific things. And every sentence needs the right ending mark." },
      { speaker: "you", text: "Professional voice on. Let me handle Frostbite." }
    ],
    challenges: [
      {
        type: "mc",
        q: "Which opening fits a professional client email to Frostbite Foods?",
        hint: "Clients want calm, clear, and respectful. Save the slang for the break room.",
        options: [
          { text: "Thank you for your interest in Nitro-Nacho Puffs. We would be glad to discuss your order.", correct: true,
            fb: "Warm, clear, and professional. Perfect for a client." },
          { text: "yo!! you want the puffs?? lets gooo", correct: false,
            fb: "Way too casual, no capitals, and no real information. A client would not trust this." },
          { text: "We guess you probably want some puffs or whatever works.", correct: false,
            fb: "Vague and unsure. 'We guess' and 'or whatever' make the company sound careless." },
          { text: "ATTENTION: BUY THE PUFFS NOW BEFORE IT IS TOO LATE!!!", correct: false,
            fb: "All caps and pushy. This reads like a scam, not a partner." }
        ]
      },
      {
        type: "mc",
        q: "Which sentence uses capital letters correctly?",
        hint: "Capitalize the first word, names of people, and names of specific products or companies.",
        options: [
          { text: "Our manager, Tavisha, will deliver the Nitro-Nacho Puffs on Monday.", correct: true,
            fb: "Correct. First word, the name Tavisha, the product name, and the day Monday are all capitalized." },
          { text: "our manager, tavisha, will deliver the nitro-nacho puffs on monday.", correct: false,
            fb: "Names, products, and days need capitals. This sentence is all lowercase." },
          { text: "Our Manager, tavisha, Will Deliver The Puffs On monday.", correct: false,
            fb: "Random capitals on regular words like 'Will' and 'The,' but the name and day are wrong. Messy." },
          { text: "our manager, Tavisha, will deliver the Nitro-Nacho puffs on Monday.", correct: false,
            fb: "Close, but the first word 'our' and the full product name need capitals too." }
        ]
      },
      {
        type: "mc",
        q: "Pick the sentence with the correct ending mark.",
        hint: "A statement ends with a period. A real question ends with a question mark. Save exclamation points for true surprises.",
        options: [
          { text: "Could you confirm the delivery date for the order?", correct: true,
            fq: false, correctMark: true,
            fb: "It asks something, so it ends with a question mark. Correct." },
          { text: "Could you confirm the delivery date for the order.", correct: false,
            fb: "This is a question, so it needs a question mark, not a period." },
          { text: "We shipped your order?", correct: false,
            fb: "This is a statement, not a question. It should end with a period." },
          { text: "We shipped your order!!!", correct: false,
            fb: "Three exclamation points make a calm update sound frantic. A single period is more professional." }
        ]
      },
      {
        type: "sort",
        hardOnly: true,
        q: "Expert check. Sort each phrase by where it belongs.",
        instructions: "Drag each card to a bin, or tap a card then tap a bin.",
        hint: "A client email is formal and polite. A team chat can be relaxed.",
        buckets: [
          { id: "client", label: "Client Email", kind: "good" },
          { id: "team", label: "Team Chat", kind: "neutral" }
        ],
        items: [
          { text: "Please let us know if you have any questions.", bucket: "client",
            fb: "Polite and clear. Great for a client." },
          { text: "lol the puffs are gonna sell out fast", bucket: "team",
            fb: "Casual and fun. Fine for a quick team chat, not for a client." },
          { text: "We appreciate your continued partnership.", bucket: "client",
            fb: "Professional and warm. Client-ready." },
          { text: "ok cool ill ping you later", bucket: "team",
            fb: "Relaxed shorthand. Keep it in the team channel." }
        ]
      }
    ],
    outro: [
      { speaker: "max", text: "Frostbite signed. They said we sounded, and I quote, 'like real adults.' Huge." },
      { speaker: "buzz", text: "Badge: Comms Cadet. You can match your words to your reader. That is half of business writing." }
    ]
  },

  /* ========================================================
     CASE 4 — WEEK 4: Nouns, pronouns, reference clarity
  ======================================================== */
  {
    id: 4,
    week: 4,
    title: "Who Said What?",
    skill: "Week 4 · Nouns, pronouns, and clear reference",
    badge: "Junior Associate",
    intro: [
      { speaker: "narrator", text: "An email chain explodes. 'They said it was not approved, but this should have been updated already.' Nobody knows who 'they' is." },
      { speaker: "buzz", text: "Pronouns like 'it,' 'they,' and 'this' are shortcuts. Shortcuts are great until the reader has no idea what they point to." },
      { speaker: "buzz", text: "The fix is simple: name the thing. Use a clear noun the first time, then a pronoun only when it is obvious." },
      { speaker: "you", text: "Time to figure out who 'they' actually is." }
    ],
    challenges: [
      {
        type: "mc",
        q: "Which sentence is CLEAR about who or what it means?",
        hint: "If you have to ask 'wait, which one?', the pronoun is too vague.",
        options: [
          { text: "Legal told Marketing that Legal had not approved the label yet.", correct: true,
            fb: "Clear. We know exactly who did what. No guessing." },
          { text: "They told them that they had not approved it yet.", correct: false,
            fb: "Four vague pronouns. Who told whom? Approved what? Total confusion." },
          { text: "Legal told them it was not done yet.", correct: false,
            fb: "Who is 'them'? What is 'it'? Still unclear." },
          { text: "After they met, this caused a problem with that.", correct: false,
            fb: "'They,' 'this,' and 'that' all point to nothing. The reader is lost." }
        ]
      },
      {
        type: "mc",
        q: "Fix the vague pronoun. 'Operations told Sales it was delayed.' What was delayed?",
        hint: "Replace the vague 'it' with the actual thing so the reader is sure.",
        options: [
          { text: "Operations told Sales the shipment was delayed.", correct: true,
            fb: "Naming 'the shipment' removes all doubt. Clear and professional." },
          { text: "Operations told Sales it was delayed, you know, the thing.", correct: false,
            fb: "'The thing' is even vaguer. This makes it worse." },
          { text: "They told them it was delayed.", correct: false,
            fb: "Now even the people are vague. Two steps backward." },
          { text: "It was delayed, Operations told Sales.", correct: false,
            fb: "Flipping the order does not fix 'it.' We still do not know what was delayed." }
        ]
      },
      {
        type: "sort",
        q: "Sort each sentence. Is the meaning clear, or is the pronoun vague?",
        instructions: "Drag each card to a bin, or tap a card then tap a bin.",
        hint: "Ask: does every 'it,' 'they,' or 'this' clearly point to one thing?",
        buckets: [
          { id: "clear", label: "Clear", kind: "good" },
          { id: "vague", label: "Vague", kind: "bad" }
        ],
        items: [
          { text: "Marketing finished the ad and sent the ad to Max.", bucket: "clear",
            fb: "We know exactly what was sent. Clear." },
          { text: "She gave it to her after they fixed this.", bucket: "vague",
            fb: "Five pronouns, zero clarity. Vague." },
          { text: "The driver dropped off the order at Warehouse B.", bucket: "clear",
            fb: "Every noun is named. Clear." },
          { text: "They said it would be ready, but this changed.", bucket: "vague",
            fb: "Who is 'they'? What is 'it' and 'this'? Vague." }
        ]
      },
      {
        type: "mc",
        hardOnly: true,
        q: "Expert check. Which sentence uses 'its' and 'it's' correctly?",
        hint: "'It's' means 'it is.' 'Its' shows ownership, like 'its flavor.' No apostrophe for ownership.",
        options: [
          { text: "It's a strong launch, and the product kept its bright color.", correct: true,
            fb: "Correct. 'It's' = 'it is,' and 'its' shows the color belongs to the product." },
          { text: "Its a strong launch, and the product kept it's bright color.", correct: false,
            fb: "Backwards. The first needs 'It's' (it is), the second needs 'its' (ownership)." },
          { text: "Its a strong launch, and the product kept its bright color.", correct: false,
            fb: "The first one should be 'It's' because it means 'it is.'" },
          { text: "It's a strong launch, and the product kept it's bright color.", correct: false,
            fb: "The second 'it's' is wrong. Ownership uses 'its' with no apostrophe." }
        ]
      }
    ],
    outro: [
      { speaker: "max", text: "Turns out 'they' was me. I never approved it. Awkward. Anyway, great work." },
      { speaker: "buzz", text: "Badge: Junior Associate. Real promotion. When you name things clearly, fewer fires start. Keep going." }
    ]
  },

  /* ========================================================
     CASE 5 — WEEK 5: Combining sentences, variety, conciseness
  ======================================================== */
  {
    id: 5,
    week: 5,
    title: "Smooth Operator",
    skill: "Week 5 · Combining sentences and cutting clutter",
    badge: "Routine Ops Specialist",
    intro: [
      { speaker: "narrator", text: "Final case before the corner office. The weekly ops report is technically correct, but it reads like a robot wrote it. Short. Choppy. Repetitive." },
      { speaker: "buzz", text: "Good writing has rhythm. Combine short, related sentences with a connector word so the ideas flow." },
      { speaker: "buzz", text: "And cut the clutter. If a word is not doing a job, fire it. Busy people read fast." },
      { speaker: "you", text: "Make it smooth. On it." }
    ],
    challenges: [
      {
        type: "mc",
        q: "Combine these two choppy lines: 'We tested the sushi. It melted.' Pick the smoothest version.",
        hint: "Use one connector word to show the surprise. The result was not what we expected.",
        options: [
          { text: "We tested the sushi, but it melted.", correct: true,
            fb: "'But' shows the surprise and joins the ideas smoothly. Clean combine." },
          { text: "We tested the sushi. It melted. It was bad. Very bad.", correct: false,
            fb: "Still choppy and now repetitive. This adds words without adding rhythm." },
          { text: "We tested the sushi it melted.", correct: false,
            fb: "That is a run-on. Combining ideas still needs proper punctuation or a connector." },
          { text: "We tested the sushi, it melted.", correct: false,
            fb: "A comma alone is a comma splice. Add 'but' to fix it." }
        ]
      },
      {
        type: "mc",
        q: "Cut the clutter. Which version says the same thing in the clearest way?",
        hint: "Look for repeated or empty words you can delete without losing meaning.",
        options: [
          { text: "Please send the report by Friday.", correct: true,
            fb: "Direct and complete. Every word earns its place." },
          { text: "At this point in time, please go ahead and send the report to us by Friday if possible.", correct: false,
            fb: "Lots of filler: 'at this point in time,' 'go ahead and,' 'if possible.' Cut them." },
          { text: "Send. The report. By Friday. Please.", correct: false,
            fb: "Too choppy. The fragments make it hard to read, not clearer." },
          { text: "We were wondering if you could maybe possibly send the report sometime around Friday.", correct: false,
            fb: "'Maybe possibly' and 'sometime around' make it weak and vague. Be direct." }
        ]
      },
      {
        type: "build",
        q: "Build a smooth combined sentence about the launch.",
        instructions: "Drag the words into the box in order, or tap each word to add it.",
        hint: "Two ideas joined by a connector. Start with 'The launch sold out' then add the reason.",
        chips: ["The launch", "because", "sold out", "the ads worked"],
        answer: ["The launch", "sold out", "because", "the ads worked"],
        fb: "'The launch sold out because the ads worked.' Two ideas, one smooth sentence, with a clear reason."
      },
      {
        type: "mc",
        hardOnly: true,
        q: "Expert check. Which sentence has the strongest, clearest structure?",
        hint: "The best version is active, direct, and free of filler. Who did what?",
        options: [
          { text: "Marketing launched the campaign and tracked the results daily.", correct: true,
            fb: "Active and parallel: launched and tracked. Clear who did what. Strong." },
          { text: "The campaign was launched and the results were being tracked by Marketing on a daily basis.", correct: false,
            fb: "Passive and wordy. 'Was launched,' 'were being tracked,' 'on a daily basis' all slow it down." },
          { text: "Marketing did a launch of the campaign and also was doing tracking of results every day.", correct: false,
            fb: "'Did a launch' and 'was doing tracking' are clunky. Use strong verbs: launched, tracked." },
          { text: "There was a campaign that Marketing launched, and there was tracking too.", correct: false,
            fb: "'There was' buries the action. Start with the doer: Marketing." }
        ]
      }
    ],
    outro: [
      { speaker: "max", text: "The report has RHYTHM now. I read the whole thing. I never read the whole thing." },
      { speaker: "buzz", text: "Badge: Routine Ops Specialist. You combine, you trim, you flow. There is only one rank left." }
    ]
  }
];
