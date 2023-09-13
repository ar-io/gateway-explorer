import type { Meta, StoryObj } from "@storybook/react";

import { GarTable } from "./GarTable";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/GarTable",
  component: GarTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof GarTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Empty: Story = {
  args: {
    data: [],
  },
};

import GatewayAddressRegistryItem from "../fixtures/GatewayAddressRegistryItem.json";
import { zGatewayAddressRegistryItem } from "@/types";
const item = zGatewayAddressRegistryItem.parse(GatewayAddressRegistryItem);
export const OneItem: Story = {
  args: {
    data: [item],
  },
};

import GatewayAddressRegistryCache from "../fixtures/GatewayAddressRegistryCache.json";
import { zGatewayAddressRegistryCache } from "@/types";
import { extractGarItems } from "@/lib/convert";
const garCache = zGatewayAddressRegistryCache.parse(
  GatewayAddressRegistryCache
);
const items = extractGarItems(garCache);
export const ManyItems: Story = {
  args: {
    data: items,
  },
};