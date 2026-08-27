# Tabs

Switch panels, in a default or underline variant.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@antkit/react';
```

Tabbed panels.

```tsx
<Tabs defaultValue="runs">
  <TabsList>
    <TabsTrigger value="runs">Runs</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
  </TabsList>
  <TabsContent value="runs">…</TabsContent>
  <TabsContent value="logs">…</TabsContent>
</Tabs>
```


Source: `@antkit/react/src/components/tabs/tabs.tsx`
