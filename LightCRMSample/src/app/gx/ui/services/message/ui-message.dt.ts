export class UIMessage {
  id: string;
  title: string;
  text: string;
  type?: string;
  confirmCaption?: string;
  cancelCaption?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
