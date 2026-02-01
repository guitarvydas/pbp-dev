For the record, I've made some minor changes to the document. There is no need to regenerate the document at present, but, remember the changes.

---

### Queue Architecture

Each part maintains exactly one input queue and one output queue. This differs from the intuitive approach of one queue per port, which can introduce subtle deadlock conditions.

The single-queue policy ensures that low-level deadlock cannot occur within the kernel itself. Deadlock remains possible in system designs, but architects must address it explicitly at the architectural level rather than battling hidden race conditions in the infrastructure.

Single queues also preserve message ordering, enabling developers to reason about event sequences. This determinism is critical for debugging and system verification.

Events are tagged with port identifiers—I call these tagged events "mevents" (events that are composed of messages + port tags). Currently, port tags and payloads are both strings. I initially experimented with complex user-defined data types but found them unnecessary. Strings provide sufficient performance for development tools and workflows while dramatically simplifying the codebase.

Effective optimization starts with architectural decisions, not low-level data representation. The simplicity of a single data type outweighs micro-optimizations. Modern techniques like regular expressions and PEG parsing make it trivial to destructure string payloads—"data structures" are essentially premature optimizations.

---
### Input Processing

Incoming mevents queue at a part's single input queue. The kernel determines when each part runs. A part dequeues one mevent and processes it to completion before accepting another.

---
Sketch added to bottom of Input Processing section

![](doc/ABCDE.png)

---

The caller supplies the routines; the receiver can call them indirectly but doesn't know their origin.

---

added diagram to port mapping section
![](doc/mapping.png)

---

CPU ICs fundamentally operate synchronously, sequentially, and with mutation. However, useful machines and devices that employ multiple kinds of components need not restrict themselves to only synchronous, sequential paradigms.

---

**PBP provides an alternative foundation—one that makes software parts truly pluggable and reusable, like LEGO® blocks. By enforcing strict boundaries, eliminating hidden dependencies, and making asynchronicity and state management first-class concerns, PBP enables systems that are comprehensible, maintainable, and composable as they evolve.**

---


add something to the "try it now" section, to the effect of: These are all tiny examples. If you want to look at something bigger, open [drawio](drawio.com) and browse `kernel.drawio` in the `https://github.com/guitarvydas/pbp-dev/tree/main/kernel` repository. That's the PBP kernel written using PBP techniques employing some 25+ different layers (it's too inconvenient to include all of those diagrams in this article using current editing technology, it's much easier just to open the source code (diagrams) in drawio). The kernel generates code in three target languages - Javascript, Python, and Common Lisp (that's all that I had the patience for, collaborators at any skill level are welcome to extend the range of target languages - contact me).

---

> - Hot-swappable parts

makes me somewhat uncomfortable, based on my definition of what hot swapping means. Should we leave it out or change it somehow?
