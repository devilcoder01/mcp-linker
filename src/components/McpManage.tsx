import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import { ServerCard } from "./ServerCard";
import { ConfigType } from "@/types/config";
import { toast } from "sonner";
import { needspathClient } from "@/lib/data";

interface McpServerProps {
  selectedApp: string;
  selectedPath: string;
}

export default function McpManage({
  selectedApp,
  selectedPath,
}: McpServerProps) {
  const [config, setConfig] = useState<ConfigType>({
    mcpServers: {},
  });

  useEffect(() => {
    if (!needspathClient.includes(selectedApp) || selectedPath) {
      loadConfig();
    }
  }, [selectedApp, selectedPath]);

  async function loadConfig() {
    try {
      const data = await invoke<ConfigType>("read_json_file", {
        appName: selectedApp,
        path: selectedPath || undefined,
      });
      if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error(`Error loading config: ${error}`);
      toast.error("Failed to load configuration");
    }
  }

  const handleUpdate = async (
    key: string,
    updatedConfig: ConfigType["mcpServers"][string],
  ) => {
    try {
      await invoke("update_mcp_server", {
        appName: selectedApp,
        path: selectedPath || undefined,
        serverName: key,
        serverConfig: updatedConfig,
      });
      toast.success("Configuration updated successfully");
    } catch (error) {
      console.error(`Error updating config: ${error}`);
      toast.error("Failed to update configuration");
    }
  };

  async function deleteConfigKey(key: string) {
    if (selectedApp === "cursor" && !selectedPath) {
      toast.error(
        "Cannot delete config: selectedPath is required for cursor app",
      );
      return;
    }
    try {
      await invoke("remove_mcp_server", {
        appName: selectedApp,
        path: selectedPath || undefined,
        serverName: key,
      });
      toast.success("Configuration deleted successfully");
    } catch (error) {
      // If backend operation fails, restore the previous state
      console.error(`Error deleting config: ${error}`);
      toast.error("Failed to delete configuration");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 p-2">
      {Object.entries(config.mcpServers).map(([key, serverConfig]) => (
        <ServerCard
          key={key}
          serverKey={key}
          config={serverConfig}
          onUpdate={handleUpdate}
          onDelete={deleteConfigKey}
        />
      ))}
    </div>
  );
}
