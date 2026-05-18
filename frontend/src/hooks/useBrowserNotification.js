import { useCallback, useEffect, useState } from "react";

export const useBrowserNotification = () => {
  const [permission, setPermission] = useState(
    typeof Notification === "undefined" ? "denied" : Notification.permission
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") {
      return "denied";
    }

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);
    return nextPermission;
  }, []);

  const notify = useCallback(
    ({ title, body }) => {
      if (typeof Notification === "undefined" || permission !== "granted") {
        return;
      }

      new Notification(title, { body });
    },
    [permission]
  );

  useEffect(() => {
    setPermission(typeof Notification === "undefined" ? "denied" : Notification.permission);
  }, []);

  return {
    permission,
    requestPermission,
    notify,
  };
};

