import { ReactElement } from "react";
import { Subject, Subscription } from "rxjs";

export type StandardOption = {
  label: string;
  value: string | number | null;
  disabled?: boolean;
};

export type MenuItemComponentType = <Option extends StandardOption, >(
  { menuItemData }: {menuItemData: Option}
) => ReactElement

export type ServiceBaseType = {
  handleMount: () => void;
  handleUnmount: () => void;
  subscribe: (serviceChangeHandler: (arg: any) => void) => void;
  unsubscribe: () => void;
  initState: (initialState :{[key: string]: any}) => void;
  setState: (newStatePart: {[key: string]: any}) => void;
  handleUpdate: (params: {[key: string]: any}) => void;
  setFunctionsFromParams: (newFunctionsFromParamsPart: {[key: string]: any}) => void;
  clearService: () => void;
  stateChangesCounter: number;
  state: {[key: string]: any};
  functionsFromParams: {[key: string]: any};
}

export type One = {
  one: string
}

export abstract class ServiceBase implements ServiceBaseType {
  #subject = new Subject();

  #subscription: Subscription | null = null

  #stateChangesCounter = 0;

  public get stateChangesCounter() {
    return this.#stateChangesCounter;
  }

  #state: {[key: string]: any} = {}

  public get state() {
    return this.#state;
  }

  #functionsFromParams: {[key: string]: any} = {}

  public get functionsFromParams() {
    return this.#functionsFromParams;
  }

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.initState = this.initState.bind(this);
    this.setState = this.setState.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.setFunctionsFromParams = this.setFunctionsFromParams.bind(this);
    this.clearService = this.clearService.bind(this);
  }

  abstract handleMount(): void

  abstract handleUnmount(): void

  public handleUpdate(params: {[key: string]: any}): void {
    const paramsKeys = Object.keys(params);
    const stateKeys = Object.keys(this.state);
    const functionsFromParamsKeys = Object.keys(this.functionsFromParams);

    const newStatePart: {[key: string]: any} = {};
    const newFunctionsFromParamsPart: {[key: string]: any} = {};

    paramsKeys.forEach(key => {
      if (stateKeys.includes(key)) {
        newStatePart[key] = params[key];
      }

      if (functionsFromParamsKeys.includes(key)) {
        newFunctionsFromParamsPart[key] = params[key];
      }
    });

    this.setState(newStatePart);
    this.setFunctionsFromParams(newFunctionsFromParamsPart);


  }

  public subscribe(serviceChangeHandler: (arg: any) => void) {
    this.#subscription = this.#subject.subscribe(serviceChangeHandler);
  }

  public unsubscribe() {
    this.#subscription && this.#subscription.unsubscribe();
  }

  public initState(initialState :{[key: string]: any}) {
    this.#state = initialState;
    this.#subject.next({ stateChangesCounter: this.stateChangesCounter + 1 });
  }

  public setState(newStatePart: {[key: string]: any} = {}) {
    this.#state = {
      ...this.#state,
      ...newStatePart
    };
    this.#subject.next({ stateChangesCounter: this.stateChangesCounter + 1 });
  }

  public setFunctionsFromParams(newFunctionsFromParamsPart: {[key: string]: any} = {}) {
    this.#functionsFromParams = {
      ...this.#functionsFromParams,
      ...newFunctionsFromParamsPart
    };
    this.#subject.next({ stateChangesCounter: this.stateChangesCounter + 1 });
  }

  public clearService() {
    this.#state = {};
    this.#functionsFromParams = {};
    this.#subject.next({ stateChangesCounter: this.stateChangesCounter + 1 });
  }
}
