import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootRoute, Router, RouterProvider } from "@tanstack/react-router";

import { ReportPasteAndGo } from "./ReportPasteAndGo";
import GatewayAddressRegistryItem from "../fixtures/GatewayAddressRegistryItem.json";
import { zGatewayAddressRegistryItem } from "@/types";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/ReportPasteAndGo",
  component: ReportPasteAndGo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  render: (args) => (
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={new Router({routeTree: new RootRoute({ component: () => <ReportPasteAndGo {...args} />})})} />
    </QueryClientProvider>
  ),
} satisfies Meta<typeof ReportPasteAndGo>;

export default meta;
type Story = StoryObj<typeof meta>;

const item = zGatewayAddressRegistryItem.parse(GatewayAddressRegistryItem);

export const NoInitial: Story = {
  args: {
    garData: [item],
    fallbackFqdnKey: "ar-io.dev",
  },
};

export const WithInitial: Story = {
  args: {
    garData: [item],
    initialTxId: "0Jahwvku_9V4OShPvpWYtiOJHO3mPFqZsahZBa0_uQc",
    fallbackFqdnKey: "ar-io.dev",
  },
};
