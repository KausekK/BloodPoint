export class EditResult {
    constructor(resultDTO, messages = []) {
      this.resultDTO = resultDTO;
      this.messages = messages;
    }
  }