# Architectural Overview

## C4 Container Diagram for Ocean Watch

### Intent

The Container diagram shows the high-level shape of the software architecture and how
responsibilities are distributed across it. It also shows the major technology choices,
how they are used, and how containers communicate with each other. It’s a high-level 
**technology focussed** diagram that is useful for software developers and
support/operations staff alike. 

A container diagram helps you answer the following questions:
1. What is the overall shape of the software system?
1. What are the high-level technology decisions?
1. How are responsibilities distributed across the system?
1. How do containers communicate with one another?
1. As a developer, where do I need to write code in order to implement features?

### Motivation

Where a System Context diagram shows your software system as a single box,
a Container diagram opens this box up to show what’s inside it. 

This is useful because:
- It makes the high-level technology choices explicit.
- It shows the relationships between containers, and how those containers communicate.

### Audience

Technical people inside and outside of the immediate software development
team; including everybody from software developers through to operational
and support staff.

```mermaid
---
title: "Ocean Watch Platform C4 Model: Container Diagram"
---
flowchart TD
  PersonResearcher["Anonymous
  External Researcher
  or Policy Maker
  [Person]
  <br>
  A researcher or policy maker
  seeking to understand the
  human-influenced pressures on
  ocean ecosystems"]
  
    subgraph SystemOceanWatch["Ocean Watch Platform<br>[Software System]"]
      ContainerWebApplication["Web Application
      [Container: Javascript/Typescript and Next.js]
      <br>
      Delivers the static content
      and the Ocean Watch
      React application"]
      ContainerNextjsApp["|Browser|
      React Application
      [Container: Javascript and React ]
      <br>
      Provides all of the
      functionality via
      their web browser"]
    end
    
    subgraph ThirdPartySystems["Third Party Systems"]
      ExtSystemAmazonS3["Resource Watch S3 Bucket
      [Data Storage]
      <br>
      Provides static images,
      partner organization logos,
      and
      coral reefs map"]

      ExtSystemMapboxAPI["Mapbox API
      [Software System]
      <br>
      Provides mapping functionality and tiles"]

      ExtSystemCartoAPI["Carto API
      [Software System]
      <br>
      Provides analysis and tiles"]

      ExtSystemGEEAPI["Google Earth Engine
      [Software System]
      <br>
      Provides tiles"]

      ExtSystemGithubAPI["GitHub API
      [Configuration Management System]
      <br>
      Stores Ocean Watch datasets"]
    end
    
    ExtSystemResourceWatchPlatform["Resource Watch Platform
    [Software System]
    <br>
    Provides ability to explore datasets
    within a geospatial context"]

    ExtSystemResourceWatchAPI["Resource Watch API
    [Software System]
    <br>
    Provides programmatic management of
    datasets, widgets, and other artifacts"]
    

  PersonResearcher -- "Visits<br><code>oceanwatchdata.org</code><br>using<br>[HTTPS]" --> ContainerWebApplication
  
  ContainerWebApplication -- "Delivers to the<br>customer's web<br>browser" --> ContainerNextjsApp
  ContainerWebApplication -- "Generates static content<br>for pages with calls<br>using<br>[HTTPS]" --> ExtSystemResourceWatchAPI
  
  ContainerNextjsApp -- "Gathers geostore, dashboard, widget,<br>datasets, and content from<br><code>api.resourcewatch.org/</code><br>using<br>[HTTPS]" --> ExtSystemResourceWatchAPI
  ContainerNextjsApp -- "Redirects traffic from researchers<br>wanting to explore datasets to<br><code>resourcewatch.org/data/explore</code><br>using<br>[HTTPS]" --> ExtSystemResourceWatchPlatform
  ContainerNextjsApp -- "Gathers static image content at<br><code>s3.amazonaws.com/wri-api-backups/resourcewatch/staging/*</code><br>or<br><code>s3.amazonaws.com/wri-api-backups/resourcewatch/production/*</code><br>using<br>[HTTPS]" --> ExtSystemAmazonS3
  ContainerNextjsApp -- "Fetches tiles and styles at<br><code>api.mapbox.com/*</code><br>using<br>[HTTPS]" --> ExtSystemMapboxAPI
  ContainerNextjsApp -- "Fetches tiles and requests analysis at<br><code>wri-rw.carto.com/api/*</code><br><code>rw-nrt.carto.com/api/*</code><br>and<br><code>a.gusc.cartocdn.com/wri-rw/api/*</code><br>using<br>[HTTPS]" --> ExtSystemCartoAPI
  ContainerNextjsApp -- "Fetches tiles at<br><code>storage.googleapis.com/gee-tiles/*</code><br>using<br>[HTTPS]" --> ExtSystemGEEAPI
  ContainerNextjsApp -- "renders widgets with links to<br><code>github.com/resource-watch/ocean-watch-data/*</code><br>using<br>[HTTPS]" --> ExtSystemGithubAPI
  
  click ExtSystemResourceWatchPlatform "https://resourcewatch.org" _blank
  click ExtSystemResourceWatchAPI "https://api.resourcewatch.org/" _blank
  
  classDef focusSystem fill:#1168bd,stroke:#0b4884,color:#ffffff
  classDef supportingSystem fill:#666,stroke:#0b4884,color:#ffffff
  classDef person fill:#08427b,stroke:#052e56,color:#ffffff
  
  class ContainerWebApplication,ContainerNextjsApp focusSystem
  class ExtSystemResourceWatchAPI,ExtSystemResourceWatchPlatform,ExtSystemAmazonS3,ExtSystemGithubAPI,ExtSystemGEEAPI supportingSystem
  class ExtSystemMapboxAPI,ExtSystemCartoAPI supportingSystem
  class PersonResearcher person
  
  style SystemOceanWatch fill:none,stroke:#CCC,stroke-width:2px,stroke-dasharray: 5 5
  style ThirdPartySystems fill:none,stroke:#CCC,stroke-width:2px,stroke-dasharray: 5 5
```

## Notes
Right-click linked nodes in the diagram when viewing in Github due to security issues.
