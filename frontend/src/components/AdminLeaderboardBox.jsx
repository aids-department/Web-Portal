import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "./ui/States";

export default function LeaderboardBox({ title, count }) {
  const category = title;

  const [selected, setSelected] = useState(
    Array.from({ length: count }, () => ({
      name: "",
      roll: "",
      year: "",
      score: "",
      time: "",
    }))
  );

  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const isEnigma =
    title.toLowerCase().includes("enigma") &&
    !title.toLowerCase().includes("codenigma");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://web-portal-760h.onrender.com/api/leaderboard/${category}`
        );
        const data = await res.json();

        if (!mounted) return;

        if (Array.isArray(data)) {
          let loaded = data.map((r) => ({
            name: r.name ?? "",
            roll: r.roll ?? "",
            year: r.year ?? "",
            score: r.score ?? "",
            time: r.time ?? "",
          }));

          if (loaded.length !== count) {
            loaded = loaded.slice(0, count);
            while (loaded.length < count) {
              loaded.push({ name: "", roll: "", year: "", score: "", time: "" });
            }
          }

          setSelected(loaded);
        }
      } catch (err) {
        console.error("load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [category, count]);

  /* ---------------- TYPING ---------------- */
  const handleTyping = (index, value) => {
    const copy = [...selected];
    copy[index] = { ...copy[index], name: value };
    setSelected(copy);

    if (value.length >= 2) {
      searchProfiles(value, index);
    } else {
      setSuggestions([]);
    }
  };

  const searchProfiles = async (query, index) => {
    try {
      const res = await fetch(
        `https://web-portal-760h.onrender.com/api/profile?q=${query}`
      );
      const profiles = await res.json();

      const filtered = profiles.filter((p) => {
        const alreadySelected = selected.some(
          (sel, idx) => idx !== index && sel.roll === p.userId
        );
        return !alreadySelected;
      });

      setSuggestions(
        filtered.map((p) => ({
          name: p.name,
          roll: p.userId,
          year: p.year,
        }))
      );
    } catch (err) {
      console.error("profile search failed", err);
      setSuggestions([]);
    }
  };

  /* ---------------- SELECT ---------------- */
  const handleSelect = (student, index) => {
    const normalizeYear = (year) => {
      const match = String(year).match(/\d+/);
      return match ? Number(match[0]) : null;
    };

    const updated = [...selected];
    updated[index] = {
      ...updated[index],
      name: student.name,
      roll: student.roll,
      year: normalizeYear(student.year),
    };

    setSelected(updated);
    setSuggestions([]);
    setActiveIndex(null);
  };

  /* ---------------- FIELD CHANGE ---------------- */
  const handleFieldChange = (index, field, value) => {
    const copy = [...selected];
    copy[index] = { ...copy[index], [field]: value };
    setSelected(copy);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    const invalid = isEnigma
      ? selected.some(
          (s) =>
            !s.name ||
            !s.roll ||
            !Number.isInteger(s.year) ||
            s.score === "" ||
            s.time === "" ||
            Number.isNaN(Number(s.score)) ||
            Number.isNaN(Number(s.time))
        )
      : selected.some(
          (s) => !s.name || !s.roll || !Number.isInteger(s.year)
        );

    if (invalid) {
      toast.error(
        isEnigma
          ? "All rows must have a valid student, year, score and time."
          : "Please select valid students for all slots.",
        { duration: 2500 }
      );
      return;
    }

    let toSave = [...selected];

    if (isEnigma) {
      toSave = toSave
        .map((s) => ({
          ...s,
          score: Number(s.score),
          time: Number(s.time),
        }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.time - b.time;
        });
    }

    try {
      await fetch(`https://web-portal-760h.onrender.com/api/leaderboard/${category}`, {
        method: "DELETE",
      });

      await Promise.all(
        toSave.map((r) =>
          fetch("https://web-portal-760h.onrender.com/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category,
              name: r.name,
              roll: r.roll,
              year: r.year,
              score: r.score,
              time: r.time,
            }),
          })
        )
      );

      setSelected(toSave);
      setLastSavedAt(new Date().toISOString());
      toast.success(`${title} saved successfully!`);
    } catch (err) {
      console.error("save failed", err);
      toast.error("Save failed. See console.");
    }
  };

  const rowGrid = isEnigma ? "2fr 0.8fr 0.8fr" : "1fr";

  return (
    <div className="flex min-h-[400px] w-full flex-col gap-3">
      <div className="surface h-[450px] overflow-y-auto p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold tracking-tight text-fg">{title}</h3>
          {loading && <Spinner className="h-4 w-4" />}
        </div>

        {isEnigma && (
          <div className="mb-2 grid gap-2 px-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted" style={{ gridTemplateColumns: rowGrid }}>
            <span>Student</span>
            <span>Score</span>
            <span>Time</span>
          </div>
        )}

        {selected.map((student, index) => (
          <div
            key={index}
            className="relative mb-2 grid items-center gap-2"
            style={{ gridTemplateColumns: rowGrid }}
          >
            <div className="relative min-w-0">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[10.5px] text-fg-muted/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <input
                type="text"
                placeholder="Select student"
                value={student.name}
                onChange={(e) => handleTyping(index, e.target.value)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => {
                  setTimeout(() => {
                    setSuggestions([]);
                    setActiveIndex(null);
                  }, 200);
                }}
                className="field py-2 pl-8 text-[13.5px]"
              />

              {activeIndex === index && suggestions.length > 0 && (
                <div className="absolute left-0 top-full z-[1000] mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border border-line bg-canvas-elevated/95 p-1 shadow-popover backdrop-blur-xl">
                  {suggestions.map((s) => (
                    <div
                      key={s.roll}
                      onMouseDown={() => handleSelect(s, index)}
                      className="cursor-pointer rounded-md px-2.5 py-2 text-[13px] text-fg transition-colors hover:bg-white/[0.06]"
                    >
                      {s.name} <span className="text-fg-muted">— Year {s.year}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isEnigma && (
              <>
                <div>
                  <input
                    type="number"
                    placeholder="Score"
                    value={student.score}
                    onChange={(e) =>
                      handleFieldChange(index, "score", e.target.value)
                    }
                    className="field px-2.5 py-2 font-mono text-[13px]"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Time (s)"
                    value={student.time}
                    onChange={(e) =>
                      handleFieldChange(index, "time", e.target.value)
                    }
                    className="field px-2.5 py-2 font-mono text-[13px]"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button className="btn-primary" onClick={handleSubmit}>
          Submit
        </button>

        <div className="font-mono text-[11px] text-fg-muted">
          {lastSavedAt
            ? `Last saved: ${new Date(lastSavedAt).toLocaleString()}`
            : ""}
        </div>
      </div>
    </div>
  );
}
