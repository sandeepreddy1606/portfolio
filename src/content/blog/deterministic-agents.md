---
title: "Why my job-application agent has no model in it"
description: "Auto Apply reads job posts and sends real emails on my behalf. The parser is regex and keyword heuristics — and that was the most important design decision in the project."
date: "2026-07-26"
tags: ["Agents", "Python", "Architecture"]
---

Auto Apply listens to private Telegram channels for job posts and applies for me. If a post contains an HR email address, it sends a templated application with my resume attached. If it points at a Google Form, it fetches the form, fills the answers from my saved profile and submits it.

Every one of those actions is irreversible. That single fact determined the architecture.

## The obvious design is the wrong one

The obvious design pipes each message into a language model and asks for structured output: company, role, contact email, form URL. It would work most of the time. Modern models are good at this.

"Most of the time" is the problem. A parser that is 97% accurate across a hundred job posts sends three wrong applications — to the wrong address, for the wrong role, with the wrong answers. Those emails cannot be recalled. The failure is silent, it is addressed to a real person, and it is in my name.

Accuracy is the wrong metric here. What matters is whether a failure is *recoverable*.

## What the parser actually does

The parser is regex and keyword heuristics. It extracts email addresses with a pattern. It finds Google Form links by matching the host. It classifies role seniority against a keyword list. When a post does not match cleanly, it does not guess — the message lands in the `manual` state and waits for me.

The result is a system whose failure mode is *doing nothing*, which is exactly the failure mode I want.

## The dashboard is the point

Every parsed message flows into a review queue with five terminal states: `review`, `applied`, `failed`, `manual`, `skipped`. Before anything is sent, I can see the parsed fields, edit them, and preview the exact email or form answers that will go out.

This is not a limitation I worked around. It is the feature. The agent's job is to do ninety seconds of tedious work and then stop and show me the result — not to be autonomous for its own sake.

## Where a model would earn its place

There are parts of this system where a model genuinely helps: drafting the cover-letter paragraph, summarising a long post into a one-line label, deciding whether a role is worth my time. Those are all *suggestions*, reviewed before they matter.

The rule I ended up with is simple, and it has held up across every agent I have built since:

> A model can decide what to propose. It should not decide what to send.

The interesting engineering in agents is rarely the prompt. It is drawing the line between the part that guesses and the part that acts — and making sure the guessing never crosses it.
