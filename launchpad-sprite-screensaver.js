(function () {
  const TRANSPARENT = ".";

  const SPRITES = [
    {
      id: "mario",
      name: "Mario",
      rows: [
        "..RRR...",
        "..RSSR..",
        "..SSSBB.",
        ".BBSYB..",
        ".RRBBBB.",
        "..BYYB..",
        ".YY..YY.",
        ".W....W.",
      ],
    },
    {
      id: "luigi",
      name: "Luigi",
      rows: [
        "..GGG...",
        "..GSSG..",
        "..SSSBB.",
        ".BBSYB..",
        ".GGBBBB.",
        "..BYYB..",
        ".YY..YY.",
        ".W....W.",
      ],
    },
    {
      id: "toad",
      name: "Toad",
      rows: [
        "..RWWR..",
        ".RWWWWR.",
        ".WWSSWW.",
        "..SSSS..",
        "..BPPB..",
        ".PPPPPP.",
        ".P....P.",
        "..Y..Y..",
      ],
    },
    {
      id: "peach",
      name: "Peach",
      rows: [
        "..YY....",
        ".YPPY...",
        ".PSSPY..",
        ".PSSSP..",
        "..PMMP..",
        ".MMMPMM.",
        ".Y....Y.",
        "..Y..Y..",
      ],
    },
    {
      id: "yoshi",
      name: "Yoshi",
      rows: [
        "...GG...",
        "..GGGG..",
        ".GGWGG..",
        ".GGRRG..",
        ".GGGGGG.",
        "..GYYG..",
        "..Y..Y..",
        ".W....W.",
      ],
    },
    {
      id: "shyguy",
      name: "Shy Guy",
      rows: [
        "..RRRR..",
        ".RWWWWR.",
        ".RWBBWWR",
        ".RWWWWR.",
        "..RBBR..",
        ".BB..BB.",
        ".M....M.",
        "........",
      ],
    },
    {
      id: "goomba",
      name: "Goomba",
      rows: [
        "...BB...",
        "..BBBB..",
        ".BBSSBB.",
        ".BWWWWB.",
        ".BBBBBB.",
        ".YB..BY.",
        ".Y....Y.",
        "..M..M..",
      ],
    },
    {
      id: "boo",
      name: "Boo",
      rows: [
        "..WWWW..",
        ".WSSSSW.",
        ".WSBBWWW",
        ".WSSSSW.",
        ".WWWWWW.",
        ".W.WW.W.",
        "..W..W..",
        "........",
      ],
    },
    {
      id: "pacman",
      name: "Pac-Man",
      rows: [
        "..YYYY..",
        ".YYYYYY.",
        ".YYY....",
        ".YY.....",
        ".YYY....",
        ".YYYYYY.",
        "..YYYY..",
        "........",
      ],
    },
    {
      id: "kirby",
      name: "Kirby",
      rows: [
        "..PPPP..",
        ".PPPPPP.",
        ".PPWWPP.",
        ".PPPPPP.",
        ".PPPPPP.",
        ".PPRRPP.",
        "..R..R..",
        ".R....R.",
      ],
    },
    {
      id: "sonic",
      name: "Sonic",
      rows: [
        "..CC....",
        ".CCCCY..",
        ".CCSSCC.",
        ".CSSYYC.",
        ".CRRRC..",
        ".YYCCY..",
        ".W..YW..",
        "........",
      ],
    },
    {
      id: "pikachu",
      name: "Pikachu",
      rows: [
        ".Y....Y.",
        ".YY..YY.",
        ".YYYYYY.",
        ".YBYYBY.",
        ".YYYYYY.",
        "..YPPY..",
        ".Y....Y.",
        "R......R",
      ],
    },
  ];

  const PALETTE = {
    [TRANSPARENT]: null,
    R: "#ff2b6e",
    G: "#00df73",
    B: "#8d5b3f",
    Y: "#ffd21f",
    W: "#f2e8e2",
    S: "#ffd6b3",
    P: "#ff78b8",
    C: "#42b6ff",
    M: "#3b2f66",
  };

  class LaunchpadSpriteScreensaver {
    constructor(options = {}) {
      if (typeof options.sendFrame !== "function") {
        throw new Error("LaunchpadSpriteScreensaver requires a sendFrame callback.");
      }
      if (typeof options.restore !== "function") {
        throw new Error("LaunchpadSpriteScreensaver requires a restore callback.");
      }
      this.sendFrame = options.sendFrame;
      this.restore = options.restore;
      this.timerId = null;
      this.frameIndex = 0;
      this.intervalMs = 900;
      this.spriteIds = SPRITES.map((sprite) => sprite.id);
    }

    getSprites() {
      return SPRITES.map((sprite) => ({ id: sprite.id, name: sprite.name }));
    }

    start(options = {}) {
      this.stop(false);
      this.intervalMs = Math.max(180, Math.min(5000, Math.round(Number(options.intervalMs) || 900)));
      this.spriteIds = this.#resolveSpriteIds(options.spriteIds);
      if (!this.spriteIds.length) {
        throw new Error("No sprites selected for the screensaver.");
      }
      this.frameIndex = 0;
      this.#renderCurrent();
      this.timerId = window.setInterval(() => {
        this.frameIndex = (this.frameIndex + 1) % this.spriteIds.length;
        this.#renderCurrent();
      }, this.intervalMs);
      return this.currentSprite();
    }

    stop(restore = true) {
      if (this.timerId) {
        window.clearInterval(this.timerId);
        this.timerId = null;
      }
      if (restore) {
        this.restore();
      }
    }

    isRunning() {
      return Boolean(this.timerId);
    }

    currentSprite() {
      const id = this.spriteIds[this.frameIndex];
      return SPRITES.find((sprite) => sprite.id === id) || null;
    }

    #renderCurrent() {
      const sprite = this.currentSprite();
      if (!sprite) {
        return;
      }
      this.sendFrame(this.#toFrame(sprite));
    }

    #resolveSpriteIds(spriteIds) {
      if (Array.isArray(spriteIds) && spriteIds.length) {
        const valid = spriteIds.filter((id) => SPRITES.some((sprite) => sprite.id === id));
        if (valid.length) {
          return valid;
        }
      }
      return SPRITES.map((sprite) => sprite.id);
    }

    #toFrame(sprite) {
      const frame = [];
      for (let row = 0; row < 8; row += 1) {
        const rowData = sprite.rows[row] || "........";
        for (let col = 0; col < 8; col += 1) {
          const token = rowData[col] || TRANSPARENT;
          frame.push(PALETTE[token] || null);
        }
      }
      return frame;
    }
  }

  window.LaunchpadSpriteScreensaver = LaunchpadSpriteScreensaver;
})();
