const PromptSuggestion = ({ icon, purpose, question }) => (
  <div className="flex-shrink-0 flex gap-2 p-4 pr-8 bg-[#88888C33;] rounded-lg">
    {icon}
    <div className="text-sm text-gray-200">
      {purpose}
      <div className="text-gray-450">{question}</div>
    </div>
  </div>
);

export default function PromptSuggestions() {
  return (
    <>
      <PromptSuggestion
        icon="🚑"
        purpose="Medical Emergency"
        question="Someone is unconscious and not breathing"
      />
      <PromptSuggestion
        icon="🔥"
        purpose="Fire Emergency"
        question="There's a house fire with people trapped inside"
      />
      <PromptSuggestion
        icon="🚔"
        purpose="Police Emergency"
        question="There's a break-in happening right now"
      />
    </>
  );
}
