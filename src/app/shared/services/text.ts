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
      throw new Error("Fallback: Oops, unable to copy");
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
      throw new Error("Async: Could not copy text: ");
    }
  }
}

export default new TextHelper();
