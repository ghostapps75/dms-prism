
import { BookOpen, Skull, Users, Terminal } from 'lucide-react';

export const ACADEMY_CONTENT = [
    {
        id: 'basics',
        title: 'PROTOCOL ALPHA: ORIGINS',
        icon: BookOpen,
        description: 'Fundamental directives for new Overseers (DMs).',
        content: `
### DIRECTIVE 01: THE OVERSEER'S ROLE
Does the Overseer need to memorize every variable? Negative. Your primary function is **Narrative Control** and **Adjudication**.
- **The Narrator:** You describe the environment. "The air is cold. The demogorgon screeches."
- **The Referee:** You interpret the laws of physics (rules). Use logic, not just the manual.
- **The Facilitator:** Ensure all test subjects (players) are engaged.

### DIRECTIVE 02: PREPARATION PARAMETERS
Do not over-calculate. Test subjects are unpredictable.
- **Start Small:** Simulate a single village or dungeon, not an entire planet.
- **Session Zero:** Mandatory calibration meeting. Align expectations on tone, lethality, and table etiquette.
- **The Golden Rule:** Fun > Rules. If a ruling halts the experiment, override it and look it up later.
        `
    },
    {
        id: 'world_building',
        title: 'PROTOCOL BETA: HOOKS',
        icon: Terminal,
        description: 'Narrative seeds for campaign initiation.',
        content: `
### FILE: CAMPAIGN_STARTERS.LOG
Initiating adventure protocols. Choose a starting vector:

1. **The "Prison Break" Variable:**
   *Subjects start incarcerated with no equipment. A sudden riot or monster attack provides a window for escape.* -> Forces immediate cooperation.

2. **The "Caravan Guard" Routine:**
   *Subjects are hired to protect a shipment. Simple combat encounter en route.* -> Low complexity introduction to mechanics.

3. **The "Mysterious Awakening" Anomaly:**
   *Subjects awake in a strange facility with partial amnesia. Who put them there?* -> High intrigue.

4. **The "Ticking Clock" Scenario:**
   *A curse is spreading through the town. Subjects have 3 days to find the source.* -> Adds urgency.

5. **The "Noble's Request" Contract:**
   *A local authority figure requires discrete retrieval of a stolen artifact.* -> Classic espionage.
        `
    },
    {
        id: 'management',
        title: 'PROTOCOL GAMMA: CONTAINMENT',
        icon: Users,
        description: 'Managing test subjects (players) and behavioral anomalies.',
        content: `
### ANOMALY: THE "MURDER HOBO"
*Definition: Subjects who resort to indiscriminate violence.*
**Containment Strategy:**
1. **Consequences:** The world must react. Guards investigate murders. Shopkeepers refuse service.
2. **Conversation:** Pause simulation. Address the subject directly. Reiterate the social contract.
3. **Ejection:** If disruption continues, remove subject from the experiment.

### ANOMALY: THE "WALLFLOWER"
*Definition: Quiet subjects who observe but do not interact.*
**Engagement Strategy:**
- Address them by name: "Will, what does your wizard think of this glyph?"
- Design encounters specific to their skills.
        `
    },
    {
        id: 'advanced',
        title: 'PROTOCOL OMEGA: IMPROV',
        icon: Skull,
        description: 'Advanced techniques for simulated reality.',
        content: `
### TECHNIQUE: "YES, AND..."
When a subject attempts an unexpected action, do not block. Accept the reality ("Yes") and add a complication ("And...").
*Example:* 
Subject: "Can I swing from the chandelier?"
Overseer: "Yes, AND as you swing, the rusty chain begins to groan loudly."

### TECHNIQUE: THE "ORACLE" DIE
When unsure of an outcome, roll a d6.
- **1-2:** Negative outcome (The door is jammed).
- **3-4:** Neutral/Complicated (The door opens but squeaks loudly).
- **5-6:** Positive outcome (The door is unlocked and oiled).

### TECHNIQUE: FAKE IT
If you are lost, pretend it is part of the plan. Subjects cannot distinguish calculated plot from panicked improvisation.
        `
    }
];
