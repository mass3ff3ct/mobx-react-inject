# mobx-react-inject
Реализация простого внедрения store в react-приложения с использованием mobx

## Установка
```bash
npm i --save mobx-react-inject reflect-metadata 
```

## Подготовка
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
```javascript
//your-main-index.ts
import "reflect-metadata"
```
## Использование
### Подключение
```javascript
import {StoreProvider} from "mobx-react-inject"

class App extends React.Component<{}, void> {
  
  render() {
    return <StoreProvider>
        ...
    </StoreProvider>
  }
}
```
### Внедрение стора в компонент
```javascript
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
### Зависимости через конструктор стора
```javascript
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
### Вложенный StoreProvider.
```javascript

import {StoreConstructor, StoreInctance} from "mobx-react-inject"

class App extends React.Component<{}, void> {
  
  private stores: Map<StoreConstructor, StoreInctance>
  
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
### Создание стора без добавления его в контейнер.
```javascript

import {StoreContainer, inject} from "mobx-react-inject"

class MyComponent extends React.Component<{}, void> {
  
  @inject
  private container: StoreContainer
  
  private myStore: MyStore
  
  componentWillMount() {
    this.myStore = this.container.resolve(MyStore)
  }
  
  render() {
    return <div>{this.myStore.hello()}</div>
  }
}
```