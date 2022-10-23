export function mapCommand(command: string, action?: string) {
  return (target) => {
    if (target) {
      target.__command__ = target.__command__ || [];
    }
    target.__command__.push({
      cmd: command,
      action: action,
    });
  };
}
