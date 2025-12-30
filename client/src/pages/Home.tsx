import { useEffect, useRef, useState } from "react";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SignInModal } from "@/components/SignInModal";
import { Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";


export default function Home() {
  const [user, setUser] = useState<any>(() => {
    try {
      const s = localStorage.getItem('travelgenie_user');
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  });
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { data: history, isLoading: isLoadingHistory } = useChatHistory();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSignInSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('travelgenie_user', JSON.stringify(userData));
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isSending]);


  const handleSend = (text: string) => {
    if (!user) return alert('Please sign in first');
    sendMessage(text);
  };


  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black text-foreground flex flex-col font-body selection:bg-primary/30">

      {/* Header */}
      <header className="fixed top-0 inset-x-0 h-20 z-50 glass-panel border-b border-white/5 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight leading-none">
              Travel<span className="text-primary">Genie</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Your Intelligent Travel Concierge
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Destinations</a>
          <a href="#" className="hover:text-primary transition-colors">Deals</a>
          <a href="#" className="hover:text-primary transition-colors">Saved</a>
          <button
            data-testid="button-signin"
            onClick={() => user ? setUser(null) : setIsSignInOpen(true)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            {user ? 'Logout' : 'Sign In'}
          </button>
        </div>
      </header>


      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col">

        {/* Welcome State */}
        {(!history || history.length === 0) && !isLoadingHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center my-auto py-12"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-8 border border-white/10 backdrop-blur-3xl shadow-2xl">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Where to next?
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              I can help you find the perfect hotel, flight, or vacation rental.
              Just tell me what you're dreaming of.
            </p>
          </motion.div>
        )}


        {/* Chat List */}
        <div className="flex-1 flex flex-col justify-end min-h-0">
          <div className="space-y-6 md:space-y-8">
            {history?.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isLast={i === history.length - 1}
              />
            ))}

            {/* Loading Indicator */}
            {isSending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-muted-foreground ml-2"
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">Thinking...</span>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </main>


      {/* Input Area - Fixed Bottom */}
      <div className="fixed bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent z-40">
        <ChatInput onSend={handleSend} isLoading={isSending} />
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSuccess={handleSignInSuccess}
      />

    </div>
  );
}
