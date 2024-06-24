import React from 'react'
import { hydrateRoot} from 'react-dom/client'
import { FluentProvider, teamsLightTheme, Button } from '@fluentui/react-components'

function ExampleApp() {
  return <FluentProvider theme={teamsLightTheme}>
    <Button>Fluent React</Button>
  </FluentProvider>
}

const container = document.querySelector('example-app')
hydrateRoot(container, <ExampleApp />)
