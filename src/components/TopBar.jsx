import InputField from "./TRCOMPONENTS/TRInputField/InputFIeld";

export default function TopBar({ query, onSearch }) {
  return (
    <header className="topbar">
      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search titles…"
          autoComplete="off"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </header>
  );
}
