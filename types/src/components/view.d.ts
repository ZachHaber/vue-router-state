export interface RouterViewProps {
    /**
     * When a {@link RouterView | `<RouterView />`} has a name, it will render the component with the corresponding name
     * in the matched route record's components option. See [Named
     * Views](https://v3.router.vuejs.org/guide/essentials/named-views.html) for an example.
     *
     * @default "default"
     */
    name?: string;
}
/**
 * Component to display the current route the user is at.
 */
declare const RouterView: import("vue").DefineComponent<import("vue").ComponentPropsOptions<import("vue").Data>, {}, {}, {}, {}, import("vue/types/v3-component-options").ComponentOptionsMixin, import("vue/types/v3-component-options").ComponentOptionsMixin, {}, string, Readonly<import("vue").ExtractPropTypes<string[]> | import("vue").ExtractPropTypes<import("vue/types/v3-component-props").ComponentObjectPropsOptions<import("vue").Data>>>, {
    [x: number]: string;
} | {}>;
export default RouterView;
