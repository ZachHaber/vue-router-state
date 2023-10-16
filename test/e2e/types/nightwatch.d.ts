import { NightwatchCommonAssertions } from 'nightwatch/types/assertions'
import {
  Awaitable,
  NightwatchAssertionsResult,
  NightwatchCustomAssertions,
} from 'nightwatch'
import { IfUnknown } from 'nightwatch/types/utils'
declare module 'nightwatch/types/custom-assertion' {
  export interface NightwatchCustomAssertions<ReturnType> {
    evaluate<Args extends Array[] = never[]>(
      fn: (...args: Args) => boolean,
      args?: Args | null,
      msg?: string,
    ): Awaitable<
      IfUnknown<ReturnType, this>,
      NightwatchAssertionsResult<string>
    >
  }
}

declare module 'nightwatch/types/custom-command' {
  export interface NightwatchCustomCommands {
    waitFor(ms: number): Awaitable<this, true | Error>
  }
}
