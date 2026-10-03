import type {ReactNode} from "react";

// The locale tree supplies its own root layout. This group supplies the root
// layout required for the standalone / redirect without nesting those trees.
export default function RedirectLayout({children}: {children: ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
