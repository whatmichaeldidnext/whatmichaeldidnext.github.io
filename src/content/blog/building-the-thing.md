---
title: The Building of the Thing which comes before the Before Building of the Thing
slug: building-the-thing
summary: I’m in that dry and slow stage of my MSc project where I’m not really
  ‘building’ the project yet, while still definitely building the project.
published: 2026-07-06
updated: 2026-07-06
featured: true
visibility: public
category:
  - learning
  - technical-note
  - project-update
relatedProjects:
  - msc-data-exposure
relatedDomains:
  - software-dev
  - research
  - computer-science
  - cybersecurity
relatedSkills:
  - data-architecture
  - requirements-analysis
  - academic-writing
relatedTechnologies:
  - graph-data-models
  - json
  - python
  - javascript
  - java
relatedTools:
  - visio
  - github
  - jira
---
I’m in that dry and slow stage of my MSc project where I’m not really ‘building’ the project yet, while still definitely building the project.

That sounds contradictory. Anyone around techy projects will recognise the boring opening phases; that bit where the exciting idea is already alive. My temptation to start thrashing out code to birth the thing, is too real; yet the work in my focal range right now is still made up of diagrams, definitions, scope boundaries, problem statements, ethical considerations, architecture sketches… and repeated attempts to explain what the project actually is and why I think it needs to ‘be’.

The “what” and the “why” stage.

My project will examine ‘username-linked data exposure’. Broadly, the idea is to explore how usernames and meta-data shared across SM platforms, become a connecting thread between different elements of the individuals online presence. Rather than a working on this as a lookup tool, I’ll be framing it as a graph-based visualisation problem: how can we best show the relationships between platforms, user identities and ‘data exposure’ pathways in a way that helps people understand the shape of their digital footprint?

That sounds much neater written down than it feels in my head.

A lot of my current work is less about exploring clever algorithms and more about answering awkward but necessary questions. What do we count as a useful signal? What should we avoid showing? How do we stop the project becoming a tool for harm? Where is the line between awareness, analysis, and misuse? What does a responsible output look like?

Coming from ‘Projects’ land, I know that these aren’t insignificant side questions just placed to waste everybody’s time. They are ‘the project’ and ultimately will contribute into my grading… but golly-gosh is it laborious.

I’m pretty confident that a basic version of the idea could be built in a couple of days (by me, at least): take a username, test a list of platform URLs, show the results. But it’s also not really the project I want to build. It’s far too blunt and already exists as part of OSINT tooling/methods. Instead, my interest is around the ‘relationship’ layer: how accounts, platforms, brokers, third-party services, and online behaviours can become connected in ways that are not obvious to normal users.

So, the current challenge is to define a project that is technical enough to satisfy the MSc reqs., is constrained enough to be ‘ethical’, is useful enough to say something meaningful about digital exposure., and, importantly, is pretty enough that people will care about the information it provides.

Therefore, I’m stuck producing system artefacts, rather than the system itself. Requirements. Constraints. Architecture. Risk boundaries. Data structures. Output rules. Graph models. Testing approaches. They feel painfully dull while making them but should become useful later when the I hit a flow-state and the project threatens to sprawl in twelve different directions.

There’s an irritating truth right here: the boring work is usually how we stop the interesting work from becoming a madness.

i.e., deciding how the system should present a confirmation of user-accounts in such a way that describes ‘confidence’, without giving a direct confirmation of user-accounts (for privacy purposes); ‘confidence’ here isn’t just a wording problem, and affects data modelling, UX, UI, the projects ethical basics…  and that’s ahead of any testing approach. Deciding to not present results as absolute confirmations changes how the whole system behaves. Identifying architectural requirements is boring, but it makes the project easier to maintain, extend, and ultimately, evaluate.

I’m also resisting the urge to make it more bigger-er every time I think of something new and cool and interesting. There is always another platform, another data source, another visualisation idea, another clever feature, another “what if?” But this isn’t a start-up pitch, nor a commercial product, nor even commercialisable. It needs clear research and developmental focus. It also needs to be finishable.

And that’s often the hardest technical requirement of all: let’s build something that can actually be called ‘Done’.

  
The eventual aim is to create an all singing proof-of-concept tool that allows a regular-ass user insight as to how the internet is a perniciously interlaced web of data-ghouls feeding from your online activity; you think of it as a simple ‘Status Update’, but FAANG and a bunch of lecherous data-brokerages are scheming on that post to better identify the best colour knickers to sell to you. Ideally, I’d like ‘outputs’ to encourage end-user reflection rather than panic. It should help someone see that online identity is not just a set of separate accounts, but an interlinked network of signals and associations.

For now, though, I’m still in the weeds: defining terms, drawing boxes, moving arrows around, arguing with my own scope, and trying to make sure the project has a strong enough foundation before I start assembling it.

It is not the most exciting part of the build; if I do it right it’ll be the part that decides whether the I’ve actually built the thing I’m trying to build… and if it’s even any good.