import getLanguageFlag from "./getLanguageFlag";

const cap = (t = "") => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "");

/** "Speaks Urdu, learning English" as one compact chip pair. */
const LanguagePair = ({ native, learning, compact = false }) => {
  if (!native && !learning) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {native && (
        <span className="lang-chip" title={`Speaks ${cap(native)}`}>
          {getLanguageFlag(native)}
          {compact ? cap(native) : `Speaks ${cap(native)}`}
        </span>
      )}
      {learning && (
        <span className="lang-chip border border-primary/30 text-primary" title={`Learning ${cap(learning)}`}>
          {getLanguageFlag(learning)}
          {compact ? cap(learning) : `Learning ${cap(learning)}`}
        </span>
      )}
    </div>
  );
};

export default LanguagePair;
