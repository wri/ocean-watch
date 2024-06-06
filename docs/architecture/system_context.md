# Architectural Overview

## C4 System Context Diagram for Ocean Watch

```mermaid
---
title: "Ocean Watch C4 Model: System Context"
---
flowchart LR
  PersonResearcher["Anonymous\nExternal Researcher\nor Policy Maker\n[Person]\n\nA researcher or policy maker\nseeking to understand the\nhuman-influenced pressures on\nocean ecosystems"]
  
  subgraph BoundaryWRI["World Resources Institute (WRI) [Organization]"]
    subgraph BoundaryOceanProgram["Ocean Program [Program]"]
      SystemOceanWatch["Ocean Watch Platform\n[Software System]\n\nAllows researchers to conduct research\nand share findings with others via\nembeddable urls and downloadable artifacts"]
    end
    subgraph BoundaryDataLab["Data Lab [Data Innovation and Product Delivery]"]
      ExtSystemResourceWatchPlatform["Resource Watch Platform\n[Software System]\n\nProvides ability to explore datasets\nwithin a mapping context"]
      ExtSystemResourceWatchAPI["Resource Watch API\n[Software System]\n\nProvides programmatic management of\ndatasets, widgets, and other artifacts"]
    end
  end

  PersonResearcher -- "Uses" --> SystemOceanWatch
  SystemOceanWatch -- "Gathers dashboard, widget,\nand content from" --> ExtSystemResourceWatchAPI
  SystemOceanWatch -- "Redirects traffic from researchers\nwanting to explore datasets to" --> ExtSystemResourceWatchPlatform
  
  click SystemOceanWatch "https://oceanwatchdata.org" _blank
  click ExtSystemResourceWatchPlatform "https://resourcewatch.org" _blank
  click ExtSystemResourceWatchAPI "https://api.resourcewatch.org/" _blank
  
  classDef focusSystem fill:#1168bd,stroke:#0b4884,color:#ffffff
  classDef supportingSystem fill:#666,stroke:#0b4884,color:#ffffff
  classDef person fill:#08427b,stroke:#052e56,color:#ffffff
  
  class SystemOceanWatch focusSystem
  class ExtSystemResourceWatchAPI,ExtSystemResourceWatchPlatform supportingSystem
  class PersonResearcher person
  
  style BoundaryWRI fill:none,stroke:#CCC,stroke-width:2px,stroke-dasharray: 5 5
  style BoundaryDataLab fill:none,stroke:#CCC,stroke-width:2px,stroke-dasharray: 5 5
  style BoundaryOceanProgram fill:none,stroke:#CCC,stroke-width:2px,stroke-dasharray: 5 5
```

## Notes
Right-click linked nodes in the diagram when viewing in Github due to security issues.