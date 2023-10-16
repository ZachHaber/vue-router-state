import type { DefineComponent, defineComponent as _define } from 'vue'
import type { HasDefined } from 'vue/types/common'
import type {
  ComponentOptionsMixin,
  ComponentOptionsWithProps,
  ComponentPropsOptions,
  ComputedOptions,
  MethodOptions,
} from 'vue/types/v3-component-options'
import type { EmitsOptions } from 'vue/types/v3-setup-context'

/**
 * Re-creation of the defineComponent function to avoid having to require vue in the resulting package
 *
 * overload 3: object format with object props declaration
 *
 * see `ExtractPropTypes` in './componentProps.ts'
 */
export function defineComponent<
  Props,
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  Emits extends EmitsOptions = {},
  EmitsNames extends string = string,
  PropsOptions extends ComponentPropsOptions = ComponentPropsOptions,
>(
  options: HasDefined<Props> extends true
    ? { functional?: never } & ComponentOptionsWithProps<
        PropsOptions,
        RawBindings,
        D,
        C,
        M,
        Mixin,
        Extends,
        Emits,
        EmitsNames,
        Props
      >
    : { functional?: never } & ComponentOptionsWithProps<
        PropsOptions,
        RawBindings,
        D,
        C,
        M,
        Mixin,
        Extends,
        Emits,
        EmitsNames
      >,
): DefineComponent<PropsOptions, RawBindings, D, C, M, Mixin, Extends, Emits> {
  return options as DefineComponent<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    Emits
  >
}
