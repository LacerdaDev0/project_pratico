
import React, { useState, useEffect } from 'react';
import { AppTab, UserRole, User, Booking, Post, ChatThread, Message, MOCK_INSTRUCTORS } from './types';
import Feed from './components/Feed';
import MapView from './components/MapView';
import Schedules from './components/Schedules';
import Profile from './components/Profile';
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import InstructorProfile from './components/InstructorProfile';
import Onboarding from './components/Onboarding';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import { Moon, Sun, Key } from 'lucide-react';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    instructorId: 'inst1',
    instructorName: 'Rodrigo Silva',
    instructorAvatar: 'https://picsum.photos/seed/rodrigo/100/100',
    imageUrl: 'https://picsum.photos/seed/surf/600/600',
    caption: 'Aulas de Surf na Praia do Recreio! 🏄‍♂️ Turmas abertas para iniciantes este final de semana.',
    likes: 124,
    timestamp: '2H'
  },
  {
    id: '2',
    instructorId: 'inst2',
    instructorName: 'Ana Oliveira',
    instructorAvatar: 'https://picsum.photos/seed/ana/100/100',
    imageUrl: 'https://picsum.photos/seed/yoga/600/600',
    caption: 'Yoga ao pôr do sol hoje foi mágico. Namastê. 🙏 Próxima aula na terça às 17h no Parque Ibirapuera.',
    likes: 89,
    timestamp: '5H'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.FEED);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [viewingInstructorId, setViewingInstructorId] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [chatDraft, setChatDraft] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Dynamic App State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'instructor') {
      setOnboardingCompleted(true);
    } else {
      setOnboardingCompleted(false);
    }
    setActiveTab(AppTab.FEED);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab(AppTab.FEED);
    setOnboardingCompleted(false);
    setChatThreads([]);
  };

  const handleOpenApiKeyDialog = async () => {
    // @ts-ignore
    if (window.aistudio && window.aistudio.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  };

  const handleAddBooking = (instructorName: string, avatar: string, subject: string) => {
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      instructorId: 'temp',
      instructorName,
      instructorAvatar: avatar,
      date: 'Em breve',
      time: 'A definir',
      status: 'confirmed',
      subject
    };
    setBookings([newBooking, ...bookings]);
    setActiveTab(AppTab.SCHEDULES);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleCreatePost = (caption: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `p-${Date.now()}`,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorAvatar: `https://picsum.photos/seed/${currentUser.id}/100/100`,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/600/600`,
      caption,
      likes: 0,
      timestamp: 'AGORA'
    };
    setPosts([newPost, ...posts]);
  };

  const sendMessage = (participantId: string, name: string, avatar: string, text: string, isFromUser: boolean) => {
    let targetThreadId = '';

    setChatThreads(prev => {
      const existingIdx = prev.findIndex(t => t.participantId === participantId);
      const newMessage: Message = {
        id: `m-${Date.now()}-${Math.random()}`,
        senderId: isFromUser ? 'user' : 'other',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (existingIdx > -1) {
        const updatedThreads = [...prev];
        const thread = updatedThreads[existingIdx];
        targetThreadId = thread.id;
        updatedThreads[existingIdx] = {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastMessage: text
        };
        const movedThread = updatedThreads.splice(existingIdx, 1)[0];
        return [movedThread, ...updatedThreads];
      } else {
        const newThreadId = `chat-${participantId}-${Date.now()}`;
        targetThreadId = newThreadId;
        const newThread: ChatThread = {
          id: newThreadId,
          participantId,
          participantName: name,
          participantAvatar: avatar,
          lastMessage: text,
          unreadCount: 0,
          messages: [newMessage]
        };
        return [newThread, ...prev];
      }
    });

    if (isFromUser) {
      setChatDraft(null);
      setShowQuickActions(false);
    }

    return targetThreadId;
  };

  const handleRequestLesson = (instructorId: string, name: string, avatar: string) => {
    setChatDraft(null);
    setShowQuickActions(true);
    
    const existing = chatThreads.find(t => t.participantId === instructorId);
    let threadId = existing?.id;
    
    if (!existing) {
      threadId = `chat-${instructorId}-${Date.now()}`;
      const newThread: ChatThread = {
        id: threadId,
        participantId: instructorId,
        participantName: name,
        participantAvatar: avatar,
        lastMessage: '',
        unreadCount: 0,
        messages: []
      };
      setChatThreads(prev => [newThread, ...prev]);
    }
    
    setSelectedChatId(threadId || null);
    setActiveTab(AppTab.CHAT);
  };

  const openChat = (instructorId: string, name: string, avatar: string) => {
    setChatDraft(null);
    setShowQuickActions(false);
    const existing = chatThreads.find(t => t.participantId === instructorId);
    if (existing) {
      setSelectedChatId(existing.id);
    } else {
      const newThreadId = `chat-${instructorId}-${Date.now()}`;
      const newThread: ChatThread = {
        id: newThreadId,
        participantId: instructorId,
        participantName: name,
        participantAvatar: avatar,
        lastMessage: '',
        unreadCount: 0,
        messages: []
      };
      setChatThreads(prev => [newThread, ...prev]);
      setSelectedChatId(newThreadId);
    }
    setActiveTab(AppTab.CHAT);
  };

  const handleViewInstructorProfile = (id: string) => {
    setViewingInstructorId(id);
    setActiveTab(AppTab.INSTRUCTOR_PROFILE);
  };

  const activeThread = chatThreads.find(t => t.id === selectedChatId);

  const renderContent = () => {
    if (!currentUser) return null;

    if (currentUser.role === 'student' && !onboardingCompleted) {
      return <Onboarding onComplete={() => setOnboardingCompleted(true)} />;
    }

    switch (activeTab) {
      case AppTab.FEED:
        return (
          <Feed 
            userName={currentUser.name}
            userRole={currentUser.role}
            posts={posts}
            onBook={(instructorName, avatar) => handleAddBooking(instructorName, avatar, 'Aula Prática')} 
            onViewSchedules={() => setActiveTab(AppTab.SCHEDULES)}
            onSearch={() => setActiveTab(AppTab.MAP)}
            onCreatePost={handleCreatePost}
          />
        );
      case AppTab.MAP:
        return (
          <MapView 
            onBook={(id, name, avatar) => handleRequestLesson(id, name, avatar)}
            onViewProfile={(id) => handleViewInstructorProfile(id)}
          />
        );
      case AppTab.CHAT_LIST:
        return (
          <ChatList 
            threads={chatThreads}
            onOpenChat={(id) => {
              setSelectedChatId(id);
              setActiveTab(AppTab.CHAT);
            }} 
            userRole={currentUser.role}
          />
        );
      case AppTab.SCHEDULES:
        return (
          <Schedules 
            bookings={bookings} 
            userRole={currentUser.role}
            onCancel={handleCancelBooking}
            onFindMore={() => setActiveTab(currentUser.role === 'instructor' ? AppTab.FEED : AppTab.MAP)}
          />
        );
      case AppTab.PROFILE:
        return (
          <Profile 
            user={currentUser}
            threads={chatThreads}
            onOpenChat={(id) => {
              setSelectedChatId(id);
              setActiveTab(AppTab.CHAT);
            }} 
            onLogout={handleLogout}
            onManageKey={handleOpenApiKeyDialog} 
          />
        );
      case AppTab.CHAT:
        return activeThread ? (
          <Chat 
            thread={activeThread}
            draftMessage={chatDraft}
            showQuickActions={showQuickActions}
            onSendMessage={(text) => sendMessage(activeThread.participantId, activeThread.participantName, activeThread.participantAvatar, text, true)}
            onBack={() => {
                setChatDraft(null);
                setShowQuickActions(false);
                setActiveTab(AppTab.CHAT_LIST);
            }} 
            onViewProfile={() => handleViewInstructorProfile(activeThread.participantId)}
          />
        ) : null;
      case AppTab.INSTRUCTOR_PROFILE:
        const instructor = MOCK_INSTRUCTORS.find(i => i.id === viewingInstructorId || i.name === viewingInstructorId);
        return instructor ? (
          <InstructorProfile 
            instructor={instructor}
            onBack={() => setActiveTab(AppTab.MAP)}
            onStartChat={() => openChat(instructor.id, instructor.name, instructor.avatar)}
            onBook={() => openChat(instructor.id, instructor.name, instructor.avatar)}
          />
        ) : null;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden">
        <Landing onLoginSuccess={handleLogin} />
      </div>
    );
  }

  const showChrome = !(currentUser.role === 'student' && !onboardingCompleted);

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-950' : 'bg-white'}`}>
      {showChrome && (
        <header className="px-5 py-4 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 border-b border-gray-50 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                 <circle cx="12" cy="12" r="10" />
                 <path d="M12 2a10 10 0 0 1 10 10M12 22a10 10 0 0 1-10-10" opacity="0.5"/>
                 <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <h1 className="text-sm font-black tracking-widest text-blue-600 uppercase">
              Prático
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-gray-300"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button onClick={() => setActiveTab(AppTab.PROFILE)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 dark:border-slate-800">
              <img src={`https://picsum.photos/seed/${currentUser.id}/100/100`} alt="Profile" className="w-full h-full object-cover" />
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto hide-scrollbar ${showChrome ? 'pb-24' : ''}`}>
        {renderContent()}
      </main>

      {showChrome && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={currentUser.role}
        />
      )}
    </div>
  );
};

export default App;
