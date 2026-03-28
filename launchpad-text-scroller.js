(function () {
  class LaunchpadTextScroller {
    static HEADER = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x07];

    constructor(sendFn) {
      if (typeof sendFn !== "function") {
        throw new Error("LaunchpadTextScroller requires a send function.");
      }
      this.sendFn = sendFn;
    }

    scroll(options = {}) {
      const textBytes = this.#encodeText(options.text || "");
      if (!textBytes.length) {
        throw new Error("Enter some text to scroll.");
      }

      const loop = options.loop ? 1 : 0;
      const speed = this.#encodeSpeed(options.speed ?? 7, options.direction || "rtl");
      const colorSpec = this.#encodeColor(options.color || "#4de0a8");
      const message = [
        ...LaunchpadTextScroller.HEADER,
        loop,
        speed,
        ...colorSpec,
        ...textBytes,
        0xF7,
      ];
      this.sendFn(message);
      return {
        sanitizedText: String.fromCharCode(...textBytes),
        speedByte: speed,
      };
    }

    stop() {
      this.sendFn([...LaunchpadTextScroller.HEADER, 0xF7]);
    }

    #encodeText(text) {
      return Array.from(String(text), (char) => {
        const code = char.charCodeAt(0);
        return code >= 32 && code <= 126 ? code : 63;
      }).slice(0, 200);
    }

    #encodeSpeed(speed, direction) {
      const wholeSpeed = Math.max(1, Math.min(63, Math.round(Number(speed) || 7)));
      if (direction === "ltr") {
        return (0x80 - wholeSpeed) & 0x7F;
      }
      return wholeSpeed;
    }

    #encodeColor(hex) {
      const { r, g, b } = this.#hexToRgb(hex);
      return [1, this.#toMidi7(r), this.#toMidi7(g), this.#toMidi7(b)];
    }

    #hexToRgb(hex) {
      const normalized = String(hex || "").trim();
      const match = normalized.match(/^#?([0-9a-f]{6})$/i);
      if (!match) {
        return { r: 77, g: 224, b: 168 };
      }
      const value = match[1];
      return {
        r: Number.parseInt(value.slice(0, 2), 16),
        g: Number.parseInt(value.slice(2, 4), 16),
        b: Number.parseInt(value.slice(4, 6), 16),
      };
    }

    #toMidi7(value) {
      return Math.max(0, Math.min(127, Math.round((Number(value) / 255) * 127)));
    }
  }

  window.LaunchpadTextScroller = LaunchpadTextScroller;
})();
