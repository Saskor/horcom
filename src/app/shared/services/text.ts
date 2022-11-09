class TextHelper {
  private fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  }

  public async copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);

      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Async: Could not copy text: ", err);
    }
  }
}

export default new TextHelper();
