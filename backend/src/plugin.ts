import type { ElementName } from "@maestroza/kernel";
import type { MaestrozaPlatform } from "../../platform/dist/platform.js";
import type { ConfigPluginDefinition } from "./config.js";

const loadPluginArray = async (pluginDefinitionArray: ConfigPluginDefinition[], platform:MaestrozaPlatform) => {
  for (const pluginDefinition of pluginDefinitionArray) {
    const pluginName = pluginDefinition.name as ElementName;
    const pluginPath = pluginDefinition.path;
    await platform.loadPlugin(pluginName, pluginPath);
  }
};

export { loadPluginArray };
