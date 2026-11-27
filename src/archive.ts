export type Song = {
  archiveTime: number;
  song: string;
  data: string;
  startURL: string;
};

export type Archive = {
  archiveTitle: string;
  archiveTime: number;
  songs: Song[];
};

type RawSong = Song & { archiveTitle: string };

type Response = {
  status: "ok" | "ng";
  songs: RawSong[];
};

const SETLIST_URL =
  "https://script.google.com/macros/s/AKfycbzQGP4WyU0NGuHkNPkjmPoVA01MoYBYLD3_-woaIXm1FKwYIsLIan6YVgfja_yDWwosWg/exec";

export async function fetchArchives(): Promise<Archive[]> {
  const response = await fetch(SETLIST_URL);
  if (!response.ok) {
    throw new Error(`setlist fetch failed: ${response.status}`);
  }
  const data = (await response.json()) as Response;
  if (data.status !== "ok") {
    throw new Error("setlist API returned status ng");
  }
  return groupByArchive(data.songs);
}

function groupByArchive(songs: RawSong[]): Archive[] {
  const archives = new Map<string, Archive>();
  for (const { archiveTitle, ...song } of songs) {
    const archive = archives.get(archiveTitle);
    if (archive) {
      archive.songs.push(song);
    } else {
      archives.set(archiveTitle, {
        archiveTitle,
        archiveTime: song.archiveTime,
        songs: [song],
      });
    }
  }
  return [...archives.values()];
}
