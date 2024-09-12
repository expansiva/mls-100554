/// <mls shortName="pluginBaseIndex" project="100554" enhancement="_blank" />

export abstract class PluginBaseIndex {

    abstract getMenus(): mls.plugin.MenuAction[];

    abstract getHooks(): mls.plugin.HookAction[];

    abstract getServices(): mls.plugin.ServiceAction[];

}

// this class is a abstract class, so use "disabled"
export default "disabled"; // or: export default new Pluginxxx()
