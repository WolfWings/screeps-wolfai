This repository is partially meant for off-site backup, and partially meant for sharing code with others.

The AIs currently included are:

 * simple-flags

   This AI is EXTREMELY minimal, fitting into a single source file and maintaining readability above all else.
   It doesn't differentiate roles, so it's far from efficient, but it will let you get bootstrapped in Screeps
   quickly when just starting out, and will grind to RCL6 or higher in a fresh Newbie/Respawn sector and raise
   your GCL up by roughly 2 easily.

   Most development has ceased on this, except for periodic backporting of code efficiency improvements I find
   from later AI work.

 * queues

   This is my AI I am currently focussing on; it has a much higher reliance on tick-to-tick memory to minimize
   the amount of CPU spent constantly 'recalculating' and attempts to use very efficient methods as much as it
   can, such as drop mining immediately and having purpose-built creeps.
