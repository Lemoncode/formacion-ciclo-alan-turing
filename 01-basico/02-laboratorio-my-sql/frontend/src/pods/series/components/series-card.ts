import type { Series } from "../series.model";
import { rankLabel, genreColorIndex } from "../series.business";

const GENRE_CLASSES = [
  "text-[#ff2d78] border-[#ff2d7840] bg-[#ff2d7810]", // pink
  "text-[#b45aff] border-[#b45aff40] bg-[#b45aff10]", // violet
  "text-[#00dfd8] border-[#00dfd840] bg-[#00dfd810]", // cyan
  "text-[#ffd166] border-[#ffd16640] bg-[#ffd16610]", // warm yellow
  "text-[#ff6b35] border-[#ff6b3540] bg-[#ff6b3510]", // orange
];

export function createSeriesCard(
  series: Series,
  position: number,
  onVote: (id: number) => void,
): HTMLElement {
  const card = document.createElement("article");
  card.dataset.seriesId = String(series.id);
  card.className = [
    "flex flex-col gap-3 p-5 rounded-xl",
    "bg-[#1a1a2e] border border-[#2a2a4a]",
    "hover:border-[#ff2d7844] hover:shadow-[0_0_20px_#ff2d7820]",
    "transition-all duration-200",
  ].join(" ");

  const genreColorClass = GENRE_CLASSES[genreColorIndex(series.genre)];

  card.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                  font-mono font-bold text-sm bg-[#1f1f38] border border-[#2a2a4a]
                  text-[#00dfd8]">
        ${rankLabel(position)}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-[#e8e8f0] truncate leading-tight">${escHtml(series.title)}</p>
        <div class="flex flex-wrap items-center gap-1 mt-1">
          ${
            series.genre !== "—"
              ? `<span class="text-[0.65rem] font-semibold uppercase tracking-wider
                             px-2 py-0.5 rounded-full border ${genreColorClass}">
                   ${escHtml(series.genre)}
                 </span>`
              : ""
          }
          ${
            series.year !== "—"
              ? `<span class="text-[0.75rem] text-[#7878a0]">${escHtml(series.year)}</span>`
              : ""
          }
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between pt-3 border-t border-[#2a2a4a] mt-auto">
      <div>
        <span class="js-votes font-mono font-bold text-lg text-[#ff2d78]">${series.votes}</span>
        <span class="text-[0.65rem] text-[#7878a0] uppercase tracking-widest ml-1">votos</span>
      </div>
      <button
        class="js-vote-btn px-4 py-1.5 rounded-lg text-[0.8rem] font-bold
               border border-[#ff2d78] text-[#ff2d78]
               hover:bg-[#ff2d78] hover:text-white
               active:scale-95 transition-all duration-150"
      >
        ⚡ Votar
      </button>
    </div>
  `;

  card
    .querySelector(".js-vote-btn")!
    .addEventListener("click", () => onVote(series.id));
  return card;
}

function escHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
