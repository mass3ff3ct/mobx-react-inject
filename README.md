# mobx-react-inject
Implementation of store injection to react component with mobx, typescript and decorator metadata

## Installation
```bash
npm i --save mobx-react-inject reflect-metadata 
```

## Preparations
```json
//tsconfig.json
{
   "compilerOptions": {
      //...
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      //...
  }
}
```
```ts
//your-main-index.ts
import "reflect-metadata"
```
## Usage
### Create store provider
```ts
import {StoreProvider} from "mobx-react-inject"

class App extends React.Component<{}, void> {
  
  render() {
    return <StoreProvider>
        ...
    </StoreProvider>
  }
}
```
### Inject your store to component
```ts
class MyStore {
  public hello() {
    return "Hello"
  }
}
// ----
import {inject} from "mobx-react-inject"
class MyComponent extends React.Component<{}, void> {
  
  @inject
  private myStore: MyStore
  
  render() {
    return <span>{this.myStore.hello()}</span>
  }
}
```
### Store-to-store injection
```ts
class MyStoreDep {
  public word() {
    return "word"
  }  
}
class MyStore {
  
  constructor(@inject private myStoreDep: MyStoreDep)
  
  public hello() {
    return `Hello ${this.myStoreDep.word()}` 
  }
}
```
### Nested store providers
```ts

import {StoreConstructor, StoreInstance} from "mobx-react-inject"

class App extends React.Component<{}, void> {
  
  private stores: Map<StoreConstructor, StoreInstance>
  
  componentWillMount() {
    this.stores = new Map([
      [MyStore, new MyStore()]
    ])
  }
  
  render() {
    return <StoreProvider stores={this.stores}>
      <StoreProvider>
         ...
      </StoreProvider>
    </StoreProvider>
  }
}
```
