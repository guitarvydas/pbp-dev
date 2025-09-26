# Five Whys

Fivewhys uses the openai API to ask - 5 times - 'Why is concurrency co difficult?'. Only the fifth answer is sent to the output port. The intermediate answers are pumped to the "A" probe, so that we can watch what's happening. In the final version, we would want to remove the ?A probe and the wire going to it and only look at the fifth answer.

"Agency" is code that accesses the openai API. It was written by Emil Valeev in Go.

Open the source code to fivewhys - `fivewhys.drawio` - in the draw.io editor (https://app.diagrams.net). If you want to look at Emil's code, use your favourite text editor.

# usage
set the environment variable OPENAI_API_KEY (to access the openai API, you need to create a paid account - maybe someone can suggest a free alternative?)
`OPENAI_API_KEY=...`
`make`
`cat out.md`

intermediate results are printed to the output using probes ?A and ?B with lines such as `"Info" : "  @15  probe main▹main▹:?A₁...` (the `@NN` is a tick counter)

# WIP
This version is a quick test of the concept. Further experimentation can be seen in the `llm` branch of the repo. As it stands, I'm fooling around with the prompts. The experimental version seems to be too concise and veers off into thinking that the questions pertain to project management in general. I think that I will try to save the original question and provide it as context in the `why?` feedback loop.



