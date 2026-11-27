import { useEffect, useRef, useState } from "react";
import type { Archive } from "./archive.ts";
import styles from "./App.module.css";

export default function App() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [filter, setFilter] = useState("");
  const [src, setSrc] = useState("");
  const [autoplay, setAutoplay] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/data.json");
      setArchives(await res.json() as Archive[]);
    })();
  }, []);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        setSrc("");
        setFilter("");
      } else if (
        ev.key === "/" && searchRef.current &&
        document.activeElement !== searchRef.current
      ) {
        ev.preventDefault();
        searchRef.current.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = filter.trim() === "" ? archives : archives.flatMap(
    (archive) => {
      const songs = archive.songs.filter((s) => s.song.includes(filter));
      return songs.length > 0 ? [{ ...archive, songs }] : [];
    },
  );

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div>
          <h1 className={styles.title}>猫魔しろあ歌枠セットリスト</h1>
        </div>
        <div>
          <div className={styles["autoplay-container"]}>
            <h2 className={styles["autoplay-label"]}>自動再生</h2>
            <input
              id="autoplay"
              className={styles.toggle_input}
              type="checkbox"
              checked={autoplay}
              onChange={(ev) => setAutoplay(ev.currentTarget.checked)}
            />
            <label htmlFor="autoplay" className={styles.toggle_label}></label>
          </div>
          <div className={styles["isearch-container"]}>
            <label htmlFor="isearch" className={styles["isearch-label"]}>
              検索
            </label>
            <input
              id="isearch"
              ref={searchRef}
              type="text"
              value={filter}
              onChange={(ev) => setFilter(ev.currentTarget.value)}
            />
          </div>
        </div>
      </div>
      {src !== ""
        ? (
          <div
            id="overlay"
            className={`${styles.overlay} overlay-event`}
            onClick={() => setSrc("")}
          >
            <div className={styles.flex}>
              <div id="overlay-inner" className={styles["overlay-inner"]}>
                <iframe
                  id="embed"
                  className={styles["overlay-iframe"]}
                  allowFullScreen
                  frameBorder="0"
                  src={`${src}${autoplay ? "&autoplay=1" : ""}`}
                >
                </iframe>
                <button
                  id="close-btn"
                  className={`${styles["close-btn"]} overlay-event`}
                  type="button"
                  onClick={() => setSrc("")}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
        : null}
      <div className={styles.scroll}>
        {filtered.map((archive) => (
          <div key={archive.archiveTitle}>
            <p>{archive.archiveTitle}</p>
            <p className={styles.date}>
              {new Date(archive.archiveTime).toLocaleDateString().replaceAll(
                "/",
                "-",
              )}
            </p>
            <ul>
              {archive.songs.map((song) => (
                <li key={song.startURL} className={styles.songItem}>
                  <a
                    className={`${styles["link"]} overlay-event`}
                    onClick={() =>
                      setSrc(song.startURL)}
                  >
                    {song.song}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <footer>
        <p>©2023+ raa0121</p>
      </footer>
    </div>
  );
}
