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
    <div className="stack-md">
      <label className="stack-sm">
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          Split
        </span>

        <select
          value={splitOption}
          onChange={(e) => setSplitOption(e.target.value)}
        >
          {PRESET_SPLITS.map((split) => (
            <option key={split} value={split}>
              {split}
            </option>
          ))}
        </select>
      </label>

      {splitOption === "Other" && (
        <label className="stack-sm">
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Custom split name
          </span>

          <input
            value={customSplit}
            onChange={(e) => setCustomSplit(e.target.value)}
            placeholder="Enter custom split"
            required
          />
        </label>
      )}
    </div>
  );
}