"use client";

const PRESET_SPLITS = [
  "Push",
  "Pull",
  "Legs",
  "Shoulders",
  "Cardio",
  "Other",
];

type SplitSelectorProps = {
  splitOption: string;
  setSplitOption: (value: string) => void;
  customSplit: string;
  setCustomSplit: (value: string) => void;
};

export default function SplitSelector({
  splitOption,
  setSplitOption,
  customSplit,
  setCustomSplit,
}: SplitSelectorProps) {
  return (
    <>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Split</span>
        <select
          value={splitOption}
          onChange={(e) => setSplitOption(e.target.value)}
          style={{
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fff",
            color: "#111",
          }}
        >
          {PRESET_SPLITS.map((split) => (
            <option key={split} value={split}>
              {split}
            </option>
          ))}
        </select>
      </label>

      {splitOption === "Other" && (
        <label style={{ display: "grid", gap: 6 }}>
          <span>Custom Split Name</span>
          <input
            value={customSplit}
            onChange={(e) => setCustomSplit(e.target.value)}
            placeholder="Enter custom split"
            required
            style={{
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#fff",
              color: "#111",
            }}
          />
        </label>
      )}
    </>
  );
}