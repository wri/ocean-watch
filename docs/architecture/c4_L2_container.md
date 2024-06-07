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
  PersonResearcher["Anonymous\nExternal Researcher\nor Policy Maker\n[Person]\n\nA researcher or policy maker\nseeking to understand the\nhuman-influenced pressures on\nocean ecosystems"]
  
    subgraph SystemOceanWatch["Ocean Watch Platform\n[Software System]"]
      ContainerWebApplication["Web Application\n[Container: Javascript/Typescript and Next.js]\n\nDelivers the static content\nand the Ocean Watch\nReact application"]
      ContainerNextjsApp["|Browser|\nReact Application\n[Container: Javascript and React ]\n\nProvides all of the\nfunctionality via\ntheir web browser"]
    end
    
    subgraph ThirdPartySystems["Third Party Systems"]
      ExtSystemAmazonS3["Resource Watch S3 Bucket\n [Data Storage] \n\n Provides static images, \n partner organization logos, \n and \n coral reefs map"]
      ExtSystemMapboxAPI["Mapbox API \n [Software System] \n\n Provides mapping functionality and tiles"]
      ExtSystemCartoAPI["Carto API \n [Software System] \n\n Provides analysis and tiles"]
      ExtSystemGEEAPI["Google Earth Engine \n [Software System] \n\n Provides tiles"]
      ExtSystemGithubAPI["GitHub API \n [Configuration Management System] \n\n Stores Ocean Watch datasets"]
    end
    
    ExtSystemResourceWatchPlatform["Resource Watch Platform\n[Software System]\n\nProvides ability to explore datasets\nwithin a geospatial context"]
    ExtSystemResourceWatchAPI["Resource Watch API\n[Software System]\n\nProvides programmatic management of\ndatasets, widgets, and other artifacts"]
    

  PersonResearcher -- "Visits \n <code>oceanwatchdata.org</code> \n using \n [HTTPS]" --> ContainerWebApplication
  
  ContainerWebApplication -- "Delivers to the\ncustomer's web\nbrowser" --> ContainerNextjsApp
  ContainerWebApplication -- "Generates static content \n for pages with calls \n using \n [HTTPS]" --> ExtSystemResourceWatchAPI
  
  ContainerNextjsApp -- "Gathers geostore, dashboard, widget,\n datasets, and content from \n <code>api.resourcewatch.org/</code> \n using \n [HTTPS]" --> ExtSystemResourceWatchAPI
  ContainerNextjsApp -- "Redirects traffic from researchers\nwanting to explore datasets to\n<code>resourcewatch.org/data/explore</code>\nusing\n[HTTPS]" --> ExtSystemResourceWatchPlatform
  ContainerNextjsApp -- "Gathers static image content at \n <code>s3.amazonaws.com/wri-api-backups/resourcewatch/staging/*</code> \n or \n <code>s3.amazonaws.com/wri-api-backups/resourcewatch/production/*</code> \n using \n [HTTPS]" --> ExtSystemAmazonS3
  ContainerNextjsApp -- "Fetches tiles and styles at \n <code>api.mapbox.com/*</code> \n using \n [HTTPS]" --> ExtSystemMapboxAPI
  ContainerNextjsApp -- "Fetches tiles and requests analysis at \n <code>wri-rw.carto.com/api/*</code> \n <code>rw-nrt.carto.com/api/*</code> \n and \n <code>a.gusc.cartocdn.com/wri-rw/api/*</code> \n using \n [HTTPS]" --> ExtSystemCartoAPI
  ContainerNextjsApp -- "Fetches tiles at \n <code>storage.googleapis.com/gee-tiles/*</code> \n using \n [HTTPS]" --> ExtSystemGEEAPI
  ContainerNextjsApp -- "renders widgets with links to \n <code>github.com/resource-watch/ocean-watch-data/*</code> \n using \n [HTTPS]" --> ExtSystemGithubAPI
  
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