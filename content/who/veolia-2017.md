+++
title = "Veolia — Treasury suite"
description = "Moving a treasury platform out of the datacenter, connecting it to banks, and keeping the flows running."
date = 2015-04-11
weight = 30

[extra]
lead = "Technical consultant — treasury management software · 2015 – 2017"
+++

I was the technical consultant on a treasury management suite (Wallstreet Systems). Over those two years, the platform moved out of its old hosting, got connected to more banks, and had to keep running the whole time.

## What I did

### Analysis and delivery

- Python tooling to inject bulk transactions from CSV for new entities
- BugZilla migration from Windows to Linux (apache2, mysql, Bugzilla)
- Accounting exports (xml, xsl) to SAP and SAGE
- Support for outsourcing the back office (Next → Datalog): MT940, then MT101 / MT210 / MT300
- Reference data export (banks, entities, accounts) to Datalog
- FxAll rollout with Reuters and WSS
- Hosting migration: HP-UX → Linux, ISO environment (PROD replica at D-1, RMAN), network setup (two datacenters, MPLS), operations review

### Continuous improvement

- Development, packaging, integration and delivery
- Stored procedures to speed up reporting
- XML framework for banking flows: AFB120, MT101, MT940
- Change control in SVN
- SQL tuning (views, indexes, triggers)
- Reports and activity dashboards in the WSS suite

## Tech stack

- HP-UX, Windows Server 2003, Citrix
- Oracle, SQL Developer, PL/SQL
- Weblogic, WSS Suite (CMM, TRM, ACM), activeMQ
- SVN
- shell, Python, Perl
- SWIFT Alliance, esiadapter, FTP
