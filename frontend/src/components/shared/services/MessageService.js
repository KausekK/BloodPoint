import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { MessageType } from '../const/MessageType.model';

const isBrowser = typeof window !== 'undefined';

function showMessageObject({ msg, type }) {
  if (!isBrowser) return;

  switch (type) {
    case MessageType.SUCCESS:
      return toastr.success(msg);
    case MessageType.ERROR:
      return toastr.error(msg);
    case MessageType.INFO:
      return toastr.info(msg);
    case MessageType.WARNING:
      return toastr.warning(msg);
    default:
      return toastr.info(msg);
  }
}

export function showMessages(messages) {
  messages.forEach(showMessageObject);
}

export function showMessage(msg, type) {
  showMessageObject({ msg, type });
}

export function showError(msg) {
  showMessage(msg, MessageType.ERROR);
}