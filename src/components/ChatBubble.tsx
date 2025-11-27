interface ChatBubbleProps {
  text: string;
  author: string;
  position?: {
    left?: string;
    top?: string;
  };
  scrollProgress?: number; // 0 to 1, where text should be revealed
}

export function ChatBubble({ text, author, position, scrollProgress = 1 }: ChatBubbleProps) {
  // Calculate how many characters to display based on scroll progress
  const charsToShow = Math.floor(text.length * Math.max(0, Math.min(1, scrollProgress)));
  const displayedText = text.slice(0, charsToShow);
  const showCursor = scrollProgress > 0 && scrollProgress < 1 && charsToShow < text.length;

  return (
    <div 
      className="absolute content-stretch flex flex-col gap-[4px] items-start w-[398px]" 
      style={{ 
        left: position?.left || '0',
        top: position?.top || '0'
      }}
    >
      {/* Chat Bubble */}
      <div className="box-border content-stretch flex gap-[10px] isolate items-center justify-center opacity-90 px-[24px] py-[16px] relative rounded-br-[36px] rounded-tr-[36px] shrink-0">
        <p 
          className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] text-nowrap whitespace-pre z-[4]" 
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {displayedText}
          {showCursor && <span className="animate-pulse">|</span>}
        </p>
        
        {/* Glass Effect */}
        <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[1000px] z-[3]">
          <div className="absolute inset-0 rounded-[100px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
        </div>
        
        {/* Frost/Blur Effect */}
        <div className="absolute blur-[2px] filter inset-0 rounded-[100px] z-[2]" />
        
        {/* Background */}
        <div className="absolute bg-[#353131] inset-0 rounded-[100px] z-[1]" />
      </div>
      
      {/* Author Name */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-0 relative w-full">
            <p 
              className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[1.3] min-h-px min-w-px relative shrink-0 text-[#353131] text-[14px]" 
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
