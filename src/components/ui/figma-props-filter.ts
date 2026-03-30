/**
 * Utility to filter out Figma inspector props from component props
 * These props are added by Figma's inspector and should not be passed to DOM elements
 */
export function filterFigmaProps<T extends Record<string, any>>(props: T): Omit<T, '_fgT' | '_fgt' | '_fgS' | '_fgs' | '_fgB' | '_fgb'> {
  const { _fgT, _fgt, _fgS, _fgs, _fgB, _fgb, ...cleanProps } = props as any;
  return cleanProps;
}
