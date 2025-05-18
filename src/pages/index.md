---
layout: page
permalink: /index.html
title: "Arkansas Fighting Game Community"
---

[Join our Discord!](https://discord.gg/HMn2mTN7TQ)

## Upcoming tournaments

{% for tournament in tournaments %}
[{{ tournament.name }}]({{ tournament.url}})
{{ tournament.venueAddress }}
{{ tournament.startAt }}

{% endfor %}
