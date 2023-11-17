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
declare const _default: new () => {
    $props: RouterViewProps;
};
export default _default;
