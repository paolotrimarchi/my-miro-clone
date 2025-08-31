import React, { useState, useRef, useEffect, useCallback } from 'react';

// --- MOCK DATA ---
const generateSectionsAndBoards = (spaceId, sectionConfigs) => {
    let boardCounter = 0;
    const icons = ['📝', '💡', '📈', '🗺️', '🎨', '🚀', '🧠', '🧭'];
    const names = ['UX Deep Dive', 'Q3 Planning', 'User Research Synthesis', 'Marketing Campaign', 'Onboarding Flow', 'Design System', 'Brainstorming Session', 'Project Roadmap'];
    const dates = ['Today', 'Yesterday', 'August 28, 2025', 'August 27, 2025', 'August 26, 2025'];

    return sectionConfigs.map(config => {
        const boards = Array.from({ length: config.boardCount }, () => {
            const board = {
                id: `board-${spaceId}-${boardCounter}`,
                name: `${names[boardCounter % names.length]} #${boardCounter + 1}`,
                icon: icons[boardCounter % icons.length],
                owner: 'Paolo Trimarchi',
                lastOpenedDate: dates[boardCounter % dates.length],
                onlineUsers: Math.floor(Math.random() * 5),
                spaceId: spaceId,
                classification: 'Internal',
            };
            boardCounter++;
            return board;
        });
        return { name: config.name, boards };
    });
};


const generateRandomWidgets = () => {
    const widgets = [];
    const widgetTypes = ['sticky-note', 'shape', 'text'];
    const colors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-pink-200', 'bg-purple-200'];
    const shapes = ['rounded-md', 'rounded-lg', ''];

    for (let i = 0; i < Math.floor(Math.random() * 12) + 8; i++) {
        const type = widgetTypes[Math.floor(Math.random() * widgetTypes.length)];
        widgets.push({
            id: `widget-${i}`,
            type,
            style: {
                position: 'absolute',
                top: `${Math.random() * 85 + 5}%`,
                left: `${Math.random() * 85 + 5}%`,
                transform: `rotate(${Math.random() * 10 - 5}deg)`,
                width: type === 'text' ? '150px' : '100px',
                height: '100px',
            },
            content: type === 'text' ? 'Some descriptive text here.' : `Task ${i}`,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
    }
    return widgets;
};

const spacesData = {
    'miro-home': {
        name: 'Miro Home',
        members: 13,
        hasOverview: false,
        pinned: true,
        icon: '🏠',
        sections: generateSectionsAndBoards('miro-home', [{ name: 'Shareouts', boardCount: 2 }, { name: 'Workshop', boardCount: 3 }, { name: 'Context', boardCount: 4 }, { name: 'Planning', boardCount: 2 }]),
    },
    'spaces-basics': {
        name: 'Spaces - Basics',
        members: 1,
        hasOverview: true,
        pinned: true,
        icon: '🚀',
        sections: generateSectionsAndBoards('spaces-basics', [{ name: 'Context', boardCount: 4 }, { name: 'Problem & Prioritization', boardCount: 2 }, { name: 'Experiments', boardCount: 3 }]),
    },
    'core-experience': {
        name: 'Core Experience Stream',
        members: 42,
        hasOverview: true,
        pinned: true,
        icon: '🌟',
        sections: generateSectionsAndBoards('core-experience', [{ name: 'User Journey', boardCount: 3 }, { name: 'Pain Points', boardCount: 5 }]),
    },
    'main-hub': {
        name: 'MiroWoW Main Hub',
        members: 120,
        hasOverview: false,
        pinned: true,
        icon: '🏰',
        sections: generateSectionsAndBoards('main-hub', [{ name: 'Announcements', boardCount: 2 }, { name: 'Team Resources', boardCount: 6 }]),
    },
    'growth-core': {
        name: '[Growth] Core',
        members: 25,
        hasOverview: false,
        pinned: false,
        icon: '📈',
        sections: generateSectionsAndBoards('growth-core', [{ name: 'User Onboarding', boardCount: 5 }, { name: 'Activation Metrics', boardCount: 3 }, { name: 'Q3 Planning', boardCount: 4 }]),
    },
    'canvas-storage': {
        name: 'Canvas Storage',
        members: 8,
        hasOverview: false,
        pinned: false,
        icon: '🔥',
        sections: generateSectionsAndBoards('canvas-storage', [{ name: 'API Design', boardCount: 4 }, { name: 'Performance', boardCount: 2 }]),
    },
    'design-system-guild': {
        name: 'Design System Guild',
        members: 35,
        hasOverview: true,
        pinned: false,
        icon: '🎨',
        sections: generateSectionsAndBoards('design-system-guild', [{ name: 'Component Library', boardCount: 8 }, { name: 'Contribution Guidelines', boardCount: 2 }]),
    },
    'marketing-campaigns': {
        name: 'Marketing Campaigns',
        members: 18,
        hasOverview: false,
        pinned: false,
        icon: '📣',
        sections: generateSectionsAndBoards('marketing-campaigns', [{ name: 'Q3 Campaigns', boardCount: 4 }, { name: 'Social Media Assets', boardCount: 6 }]),
    }
};

const teamBoardsData = [
    {
        id: 'team-board-1',
        name: 'Quarterly Business Review',
        icon: '📊',
        owner: 'Paolo Trimarchi',
        lastOpenedDate: 'Today',
        onlineUsers: 3,
        spaceId: null,
        classification: 'Confidential'
    },
    {
        id: 'team-board-2',
        name: 'All-Hands Meeting Notes',
        icon: '🗣️',
        owner: 'Jane Doe',
        lastOpenedDate: 'Yesterday',
        onlineUsers: 0,
        spaceId: null,
        classification: 'Internal'
    }
];

const allBoards = [
    ...Object.values(spacesData).flatMap(s => s.sections.flatMap(sec => sec.boards)),
    ...teamBoardsData
];
const allBoardsMap = new Map(allBoards.map(board => [board.id, board]));


const templates = [
  { title: "Blank board", type: 'blank' },
  { title: "Roadmap Planning", type: 'blueprint', image: 'https://placehold.co/200x110/EFF6FF/3B82F6?text=Blueprint' },
  { title: "Goal Setting (OKR)", type: 'blueprint', image: 'https://placehold.co/200x110/F0FDF4/22C55E?text=Blueprint' },
  { title: "Project Workspace", type: 'standard', image: 'https://placehold.co/200x110/FEFCE8/EAB308?text=Workspace' },
  { title: "Flowchart", type: 'standard', image: 'https://placehold.co/200x110/EEF2FF/6366F1?text=Flowchart' },
  { title: "Mind Map", type: 'standard', image: 'https://placehold.co/200x110/FDF2F2/EF4444?text=Mind+Map' },
  { title: "Kanban Framework", type: 'standard', image: 'https://placehold.co/200x110/FAF5FF/A855F7?text=Kanban' },
  { title: "Quick Retrospective", type: 'standard', image: 'https://placehold.co/200x110/ECFEFF/06B6D4?text=Retro' },
  { title: "Brainwriting", type: 'standard', image: 'https://placehold.co/200x110/FFFBEB/F59E0B?text=Ideas' },
  { title: "From Miroverse", type: 'miroverse', image: 'https://placehold.co/200x110/DBEAFE/3B82F6?text=Miroverse' },
];

// --- SVG Icons ---
const SearchIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-gray-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ExploreIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 6.75 3 3.75 3C3.75 3 3 12 12 21C21 12 20.25 3 20.25 3C17.25 3 12 6.25278 12 6.25278Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" /></svg>;
const HomeIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const RecentIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const StarredIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const InsightsIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
const ChevronDownIcon = ({ className = "h-4 w-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const PlusIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-gray-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>;
const MoreHorizontalIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-gray-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" /></svg>;
const GridIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const CloseIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-gray-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const MenuIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const PlayIcon = () => <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M6.323 3.682a.5.5 0 01.765-.424l8 4.5a.5.5 0 010 .848l-8 4.5a.5.5 0 01-.765-.424V3.682z"></path></svg>;
const BackArrowIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;


// --- DASHBOARD COMPONENTS ---

const TeamSwitcher = () => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-200 cursor-pointer">
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">P</div><span className="font-semibold text-sm">Paolo's team</span></div>
        <div className="flex items-center"><ChevronDownIcon className="h-5 w-5" /></div>
    </div>
);

const DashboardSidebar = ({ onNavigateToSpace, onNavigateToRecent, activeDashboardView }) => {
    const [width, setWidth] = useState(256);
    const sidebarRef = useRef(null);

    const handleMouseDown = (e) => {
        e.preventDefault();
        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = useCallback((e) => {
        const sidebar = sidebarRef.current;
        if (sidebar) {
            const newWidth = e.clientX - sidebar.getBoundingClientRect().left;
            if (newWidth >= 220 && newWidth <= 400) setWidth(newWidth);
        }
    }, []);

    const handleMouseUp = () => {
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const [pinnedOpen, setPinnedOpen] = useState(true);
    const [allSpacesOpen, setAllSpacesOpen] = useState(true);

    const navItems = [
        { id: 'explore', icon: <ExploreIcon />, name: 'Explore' }, 
        { id: 'home', icon: <HomeIcon />, name: 'Home' }, 
        { id: 'recent', icon: <RecentIcon />, name: 'Recent' }, 
        { id: 'starred', icon: <StarredIcon />, name: 'Starred' }, 
        { id: 'insights', icon: <InsightsIcon />, name: 'Insights' }
    ];
    
    const pinnedSpaces = Object.entries(spacesData).filter(([, space]) => space.pinned);
    const allSpaces = Object.entries(spacesData).filter(([, space]) => !space.pinned);

    return (
        <aside ref={sidebarRef} style={{ width: `${width}px` }} className="bg-gray-50 flex-col h-screen border-r relative hidden md:flex">
            <div className="p-2 border-b h-16 flex items-center"><TeamSwitcher /></div>
            <div className="flex-grow overflow-y-auto">
                <div className="p-2"><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div><input type="text" placeholder="Search by title or topic" className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
                <nav className="mt-2 px-2">{navItems.map(item => <a href="#" key={item.id} onClick={(e) => {e.preventDefault(); onNavigateToRecent(item.id)}} className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium ${activeDashboardView === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>{item.icon}<span>{item.name}</span></a>)}</nav>
                <div className="mt-4 px-2">
                    <div className="mb-2">
                        <button onClick={() => setPinnedOpen(!pinnedOpen)} className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"><div className="flex items-center gap-2"><ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${pinnedOpen ? '' : '-rotate-90'}`} /><span>Pinned Spaces</span></div></button>
                        {pinnedOpen && <div className="mt-1 space-y-1 pl-4">{pinnedSpaces.map(([id, space]) => <a href="#" key={id} onClick={(e) => { e.preventDefault(); onNavigateToSpace(id); }} className="block text-sm text-gray-600 p-2 rounded-md hover:bg-gray-100 truncate">{space.name}</a>)}</div>}
                    </div>
                    <div>
                        <div className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 p-2 rounded-md"><button onClick={() => setAllSpacesOpen(!allSpacesOpen)} className="flex-grow flex items-center gap-2 text-left hover:text-gray-800 p-1 rounded-md hover:bg-gray-100"><ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${allSpacesOpen ? '' : '-rotate-90'}`} /><span>All Spaces</span></button><button className="p-1 rounded hover:bg-gray-200 flex-shrink-0"><PlusIcon className="h-4 w-4" /></button></div>
                        {allSpacesOpen && <div className="mt-1 space-y-1 pl-4">{allSpaces.map(([id, space]) => <a href="#" key={id} onClick={(e) => { e.preventDefault(); onNavigateToSpace(id); }} className="flex items-center gap-2 text-sm text-gray-600 p-2 rounded-md hover:bg-gray-100 truncate"><span>{space.icon}</span><span>{space.name}</span></a>)}</div>}
                    </div>
                </div>
            </div>
            <div onMouseDown={handleMouseDown} className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize bg-transparent hover:bg-blue-200 transition-colors duration-200"/>
        </aside>
    );
};

const DashboardHeader = () => (
    <header className="flex items-center justify-between p-4 h-16 border-b bg-white flex-shrink-0">
         <div className="flex-1 max-w-lg">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div>
                <input type="text" placeholder="Search or ask anything" className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-gray-400">⌘+Shift+E</div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></button>
                <button className="p-2 rounded-full hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-1.165.45-2.205 1.228-3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c-3 0-6 1.5-6 3v1h12v-1c0-1.5-3-3-6-3z" /></svg></button>
            </div>
            <img src="https://placehold.co/32x32/E0E0E0/000000?text=P" alt="User Avatar" className="w-8 h-8 rounded-full" />
        </div>
    </header>
);

const TemplateCard = ({ template }) => {
    if (template.type === 'blank') {
        return (
            <div className="flex flex-col items-center text-center flex-shrink-0 w-40">
                <div className="w-full h-24 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-2 hover:border-blue-500 cursor-pointer">
                    <PlusIcon className="h-8 w-8 text-gray-400" />
                </div>
                <span className="text-sm font-medium">{template.title}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center flex-shrink-0 w-40 cursor-pointer group">
             <div className="w-full h-24 rounded-lg mb-2 overflow-hidden border border-gray-200 group-hover:border-blue-500">
                <img src={template.image} alt={template.title} className="w-full h-full object-cover" />
             </div>
            <span className="text-sm font-medium">{template.title}</span>
        </div>
    );
};


const DashboardContent = ({ onNavigateToBoard }) => {
    const allBoardsInTeam = [ ...teamBoardsData, ...Object.values(spacesData).flatMap(s => s.sections.flatMap(sec => sec.boards))];

    return (
        <main className="flex-1 bg-white overflow-y-auto flex flex-col min-w-0">
            <DashboardHeader />
            <div className="p-4 md:p-8">
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                     <div className="flex space-x-4 overflow-x-auto pb-2">
                        {templates.map((template, index) => <TemplateCard key={index} template={template} />)}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="flex justify-between items-center flex-wrap gap-y-2 mb-4">
                        <h2 className="text-2xl font-bold">Boards in this team</h2>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <button className="text-sm font-medium text-blue-600 hover:underline">Explore templates</button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-blue-700">
                                <PlusIcon className="h-4 w-4 text-white" /> Create new
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-left text-sm min-w-[640px]">
                        <thead>
                            <tr className="text-gray-500 font-medium">
                                <th className="py-2 px-4 w-2/5">Name</th>
                                <th className="py-2 px-4 hidden lg:table-cell">Online users</th>
                                <th className="py-2 px-4">Space</th>
                                <th className="py-2 px-4 hidden md:table-cell">Classification</th>
                                <th className="py-2 px-4">Last opened</th>
                                <th className="py-2 px-4 hidden lg:table-cell">Owner</th>
                                <th className="py-2 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>{allBoardsInTeam.map((board) => 
                            <tr key={board.id} className="border-t hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToBoard(board); }} className="font-medium flex items-center gap-2 hover:underline">
                                        <span>{board.icon}</span>{board.name}
                                    </a>
                                    <div className="text-xs text-gray-500 ml-6">Modified by {board.owner}, {board.lastOpenedDate}</div>
                                </td>
                                <td className="py-3 px-4 hidden lg:table-cell">{board.onlineUsers > 0 && <div className="flex items-center -space-x-2"><img src={`https://placehold.co/24x24/E91E63/FFFFFF?text=A`} className="rounded-full border-2 border-white" /></div>}</td>
                                <td className="py-3 px-4 text-gray-600">{board.spaceId ? spacesData[board.spaceId].name : ''}</td>
                                <td className="py-3 px-4 hidden md:table-cell">{board.classification && <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">{board.classification}</span>}</td>
                                <td className="py-3 px-4 text-gray-600">{board.lastOpenedDate}</td>
                                <td className="py-3 px-4 hidden lg:table-cell text-gray-600">{board.owner}</td>
                                <td className="py-3 px-4"><div className="flex items-center gap-2"><button className="text-gray-400 hover:text-gray-800"><StarredIcon /></button><button className="text-gray-400 hover:text-gray-800"><MoreHorizontalIcon /></button></div></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

const RecentContent = ({ recentBoards, onNavigateToBoard }) => {
    const groupedBoards = recentBoards.reduce((acc, board) => {
        const date = board.lastOpenedDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(board);
        return acc;
    }, {});

    return (
        <main className="flex-1 bg-white overflow-y-auto min-w-0">
            <DashboardHeader />
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Recent</h1>
                    <div className="flex items-center gap-2"><button className="p-2 rounded-md hover:bg-gray-100"><GridIcon /></button></div>
                </div>
                <div className="overflow-x-auto">
                {Object.entries(groupedBoards).map(([date, boards]) => (
                    <div key={date} className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">{date}</h2>
                        <table className="w-full text-left text-sm min-w-[640px]">
                             <thead><tr className="text-gray-500 font-medium border-b"><th className="py-2 px-4 w-2/5">Name</th><th className="py-2 px-4 hidden lg:table-cell">Online users</th><th className="py-2 px-4">Space</th><th className="py-2 px-4">Last opened</th><th className="py-2 px-4 hidden lg:table-cell">Owner</th><th className="py-2 px-4"></th></tr></thead>
                            <tbody>
                                {boards.map(board => (
                                    <tr key={board.id} className="border-t hover:bg-gray-50">
                                        <td className="py-3 px-4"><a href="#" onClick={(e) => {e.preventDefault(); onNavigateToBoard(board.spaceId, board.id)}} className="font-medium flex items-center gap-2 hover:underline"><span>{board.icon}</span>{board.name}</a></td>
                                        <td className="py-3 px-4 hidden lg:table-cell">{board.onlineUsers > 0 && <div className="flex items-center -space-x-2"><img src={`https://placehold.co/24x24/E91E63/FFFFFF?text=A`} className="rounded-full border-2 border-white" /></div>}</td>
                                        <td className="py-3 px-4 text-gray-600">{board.spaceId ? spacesData[board.spaceId].name : 'Team Board'}</td>
                                        <td className="py-3 px-4 text-gray-600">{board.lastOpenedDate}</td>
                                        <td className="py-3 px-4 hidden lg:table-cell text-gray-600">{board.owner}</td>
                                        <td className="py-3 px-4"><div className="flex items-center gap-2"><button className="text-gray-400 hover:text-gray-800"><StarredIcon /></button><button className="text-gray-400 hover:text-gray-800"><MoreHorizontalIcon /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
                </div>
            </div>
        </main>
    )
}

// --- SPACE VIEW COMPONENTS ---

const SpaceMenu = ({ onSwitchSidebar, onShowRecent, closeMenu, sidebarSpaceId, activeContentSpaceId }) => {
    const pinnedSpaces = Object.entries(spacesData).filter(([, s]) => s.pinned);
    const showBackToSpace = activeContentSpaceId && sidebarSpaceId && activeContentSpaceId !== sidebarSpaceId;
    const activeContentSpaceName = showBackToSpace ? spacesData[activeContentSpaceId].name : '';

    return (
        <div className="absolute top-full mt-2 w-64 bg-white rounded-md shadow-lg border z-10 p-2 space-y-1">
            {showBackToSpace && (
                <>
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onSwitchSidebar(activeContentSpaceId); closeMenu(); }} 
                        className="flex items-center gap-3 p-2 rounded-md text-sm truncate hover:bg-gray-100 text-gray-700"
                    >
                        <BackArrowIcon />
                        <span>{activeContentSpaceName}</span>
                    </a>
                    <div className="pt-1"><div className="border-t border-gray-200"></div></div>
                </>
            )}
            <div>
                <h3 className="text-sm font-bold text-gray-800 px-2 my-2 flex items-center gap-2">
                    <StarredIcon className="h-4 w-4" /> Pinned Spaces
                </h3>
                <div className="space-y-1">
                    {pinnedSpaces.map(([id, space]) => (
                        <a href="#" key={id} onClick={(e) => { e.preventDefault(); onSwitchSidebar(id); closeMenu(); }} className="block text-sm text-gray-700 p-2 rounded-md hover:bg-gray-100 truncate">{space.name}</a>
                    ))}
                </div>
            </div>
            <div className="pt-1"><div className="border-t border-gray-200"></div></div>
            <div>
                 <a href="#" onClick={(e) => { e.preventDefault(); onShowRecent(); closeMenu(); }} className="flex items-center gap-3 p-2 rounded-md text-sm truncate hover:bg-gray-100 text-gray-700 font-medium">
                    <RecentIcon />
                    <span>Recent boards</span>
                </a>
            </div>
        </div>
    );
};


const SidebarContainer = ({ isExpanded, setIsExpanded, children }) => {
     if (!isExpanded) {
        return <div className="p-2 bg-gray-50 border-r md:hidden"><button onClick={() => setIsExpanded(true)} className="p-2 rounded-md hover:bg-gray-200"><MenuIcon /></button></div>;
    }

    return (
        <aside className="w-64 bg-gray-50 flex-col h-screen border-r transition-all duration-300 hidden md:flex">
            {children}
        </aside>
    );
}

const SpaceSidebar = ({ space, onSelectBoard, activeSidebarSelectionId }) => {
    const [openSections, setOpenSections] = useState(() => {
        const initialState = {};
        space.sections.forEach(section => { initialState[section.name] = true; });
        return initialState;
    });

    const toggleSection = (sectionName) => {
        setOpenSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
    };

    return (
        <div className="flex-grow overflow-y-auto flex flex-col p-2 h-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="font-bold text-base">{space.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">{space.members} members</p>
                </div>
                <div className="flex items-center">
                    <button className="p-2 rounded-md hover:bg-gray-200"><PlusIcon className="h-4 w-4" /></button>
                    <button className="p-2 rounded-md hover:bg-gray-200"><MoreHorizontalIcon className="h-4 w-4" /></button>
                </div>
            </div>

            <div className="flex-grow">
              {space.hasOverview && <a href="#" onClick={(e) => { e.preventDefault(); onSelectBoard('overview'); }} className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium ${activeSidebarSelectionId === 'overview' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}><span>📖</span> Overview</a>}
              {space.sections.map(section => (
                  <div key={section.name} className="mt-4">
                      <button onClick={() => toggleSection(section.name)} className="w-full flex items-center gap-2 text-sm font-semibold text-gray-600 p-1 hover:text-gray-900">
                          <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${openSections[section.name] ? '' : '-rotate-90'}`} />
                          {section.name}
                      </button>
                      {openSections[section.name] && <div className="mt-1 space-y-1 pl-2">{section.boards.map(board => <a href="#" key={board.id} onClick={(e) => { e.preventDefault(); onSelectBoard(board.id); }} className={`flex items-center gap-2 p-2 rounded-md text-sm truncate ${activeSidebarSelectionId === board.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}><span>{board.icon}</span><span>{board.name}</span></a>)}</div>}
                  </div>
              ))}
            </div>
        </div>
    );
};

const RecentBoardsSidebar = ({ recentBoards, onSelectBoard, activeSidebarSelectionId }) => {
    const groupedBoards = recentBoards.reduce((acc, board) => {
        const date = board.lastOpenedDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(board);
        return acc;
    }, {});

    return (
         <div className="flex-grow overflow-y-auto p-2 h-full">
            <div className="p-2">
              <h2 className="font-bold text-lg">Recent Boards</h2>
              <p className="text-xs text-gray-500 mb-4">Boards you have recently visited.</p>
            </div>
            {Object.entries(groupedBoards).map(([date, boards]) => (
                <div key={date} className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-600 p-1">{date}</h3>
                    <div className="mt-1 space-y-1">
                        {boards.map(board => (
                             <a href="#" key={board.id} onClick={(e) => { e.preventDefault(); onSelectBoard(board.id); }} className={`flex items-center gap-2 p-2 rounded-md text-sm truncate ${activeSidebarSelectionId === board.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span>{board.icon}</span>
                                <span>{board.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const BoardHeader = ({ board }) => {
    return (
        <header className="flex items-center justify-between p-2 h-16 border-b bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1 text-lg font-semibold">
                    <span>{board.icon}</span>
                    <h1>{board.name}</h1>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md">{board.classification}</span>
                <button className="p-1 rounded-md hover:bg-gray-100"><MoreHorizontalIcon className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-2">
                    <img src="https://placehold.co/24x24/E91E63/FFFFFF?text=A" alt="user avatar" className="rounded-full border-2 border-white" />
                    <img src="https://placehold.co/24x24/3F51B5/FFFFFF?text=B" alt="user avatar" className="rounded-full border-2 border-white" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">Comment only</button>
            </div>
        </header>
    )
}

const SpaceOverview = ({ space }) => (
    <div className="w-full h-full bg-gray-100 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Widget */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-4xl font-bold mb-2">Space Overview: {space.name}</h1>
                        <p className="text-gray-600">The Overview is the central hub where project insights, action, and progress come to life. It's flexible, dynamic, and aims to redefine how teams stay aligned.</p>
                    </div>

                    {/* Key Boards Widget */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">Key Boards & Resources</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {space.sections.flatMap(s => s.boards).slice(0, 4).map(board => (
                                <div key={board.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{board.icon}</span>
                                        <div>
                                            <h3 className="font-semibold">{board.name}</h3>
                                            <p className="text-xs text-gray-500">Last opened: {board.lastOpenedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-8">
                    {/* Project Members Widget */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Project Members</h3>
                        <div className="space-y-3">
                            {['Kit Unger', 'Brett Barkman', 'Vihar...', 'Gaetano Consulo', 'Bella Morehead'].map(name => (
                                 <div key={name} className="flex items-center justify-between text-sm">
                                     <span>{name}</span>
                                     <img src={`https://placehold.co/24x24/E0E0E0/000000?text=${name.charAt(0)}`} alt={name} className="w-6 h-6 rounded-full" />
                                 </div>
                            ))}
                        </div>
                    </div>
                    {/* Status Widget */}
                     <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Project Status</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Design Phase</span>
                                    <span className="text-gray-500">80%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '80%'}}></div>
                                </div>
                            </div>
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Development</span>
                                    <span className="text-gray-500">45%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{width: '45%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MiroBoard = ({ board }) => {
    const [widgets, setWidgets] = useState([]);
    useEffect(() => { setWidgets(generateRandomWidgets()); }, [board.id]);

    return (
        <div className="w-full h-full bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-4 bg-gray-50 rounded-lg shadow-inner">
                {widgets.map(widget => (
                    <div key={widget.id} style={widget.style} className={`flex items-center justify-center p-2 shadow-lg ${widget.color} ${widget.shape}`}>
                        <p className="text-sm text-center">{widget.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SpaceBoardList = ({ space }) => {
    const allBoards = space.sections.flatMap(s => s.boards);
    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Boards in {space.name}</h2><div className="flex items-center gap-2"><button className="p-2 rounded-md hover:bg-gray-100"><GridIcon /></button></div></div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[640px]">
                    <thead><tr className="text-gray-500 font-medium"><th className="py-2 px-4 w-2/5">Name</th><th className="py-2 px-4 hidden lg:table-cell">Online users</th><th className="py-2 px-4">Last opened</th><th className="py-2 px-4 hidden lg:table-cell">Owner</th><th className="py-2 px-4"></th></tr></thead>
                    <tbody>{allBoards.map((board) => <tr key={board.id} className="border-t hover:bg-gray-50"><td className="py-3 px-4"><div className="font-medium flex items-center gap-2"><span>{board.icon}</span>{board.name}</div></td><td className="py-3 px-4 hidden lg:table-cell">{board.onlineUsers > 0 && <div className="flex items-center -space-x-2"><img src={`https://placehold.co/24x24/E91E63/FFFFFF?text=A`} className="rounded-full border-2 border-white" /></div>}</td><td className="py-3 px-4 text-gray-600">{board.lastOpenedDate}</td><td className="py-3 px-4 hidden lg:table-cell text-gray-600">{board.owner}</td><td className="py-3 px-4"><div className="flex items-center gap-2"><button className="text-gray-400 hover:text-gray-800"><StarredIcon /></button><button className="text-gray-400 hover:text-gray-800"><MoreHorizontalIcon /></button></div></td></tr>)}</tbody>
                </table>
            </div>
        </div>
    );
};

const SpaceContent = ({ activeContentContext }) => {
    if (!activeContentContext) {
        return (
            <main className="flex-1 bg-white overflow-y-auto flex flex-col min-w-0">
                <DashboardHeader />
                 <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
                    <p>Select a board to view its content</p>
                </div>
            </main>
        )
    }
    
    const { spaceId, boardId } = activeContentContext;
    const space = spaceId ? spacesData[spaceId] : null;

    if (boardId === 'overview') {
        const overviewBoardObject = {
            id: 'overview',
            name: 'Overview',
            icon: '📖',
            classification: 'Internal',
            spaceId: spaceId
        };
         return (
             <main className="flex-1 bg-white overflow-y-auto flex flex-col min-w-0">
                <BoardHeader board={overviewBoardObject} />
                <div className="flex-1 relative">
                    <SpaceOverview space={space} />
                </div>
            </main>
        )
    }

    const activeBoard = allBoardsMap.get(boardId);
    if (activeBoard) {
        return (
             <main className="flex-1 bg-white overflow-y-auto flex flex-col min-w-0">
                <BoardHeader board={activeBoard} />
                <div className="flex-1 relative">
                    <MiroBoard board={activeBoard} />
                </div>
            </main>
        )
    }
    
    if (space) {
        return (
            <main className="flex-1 bg-white overflow-y-auto flex flex-col min-w-0">
                <DashboardHeader />
                <div className="flex-1 relative"><SpaceBoardList space={space} /></div>
            </main>
        );
    }

    return null;
};

// --- Main App Component ---

export default function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [dashboardView, setDashboardView] = useState('home');
    const [sidebarContext, setSidebarContext] = useState(null);
    const [activeContentContext, setActiveContentContext] = useState(null);
    const [activeSidebarSelectionId, setActiveSidebarSelectionId] = useState(null);
    const [isSpaceSidebarExpanded, setIsSpaceSidebarExpanded] = useState(true);
    const [recentBoards, setRecentBoards] = useState([]);

    const handleNavigateToSpaceFromDashboard = (spaceId) => {
        setCurrentView('space');
        setSidebarContext(spaceId);
        const space = spacesData[spaceId];
        const boardId = space.hasOverview ? 'overview' : null;
        setActiveContentContext({ spaceId, boardId });
        setActiveSidebarSelectionId(boardId);
    };

    const handleNavigateToBoard = (board) => {
        setCurrentView('space');
        const { spaceId, id } = board;
        setSidebarContext(spaceId || 'recent');
        setActiveContentContext({ spaceId, boardId: id });
        setActiveSidebarSelectionId(id);
        
        setRecentBoards(prev => {
            const newRecent = [{...board, lastOpenedDate: 'Today'}, ...prev.filter(b => b.id !== id)];
            return [...new Map(newRecent.map(item => [item.id, item])).values()].slice(0, 15);
        });
    };
    
    const handleSwitchSidebar = (spaceId) => {
        setSidebarContext(spaceId);
        setActiveSidebarSelectionId(null);
    };

    const handleShowRecentInSpace = () => {
        setSidebarContext('recent');
        setActiveSidebarSelectionId(null);
    };
    
    const handleNavigateHome = () => {
        setCurrentView('dashboard');
        setDashboardView('home');
        setSidebarContext(null);
        setActiveContentContext(null);
        setActiveSidebarSelectionId(null);
    };

    const handleDashboardNavigation = (view) => {
        if (['home', 'recent', 'explore', 'starred', 'insights'].includes(view)) {
             setCurrentView('dashboard');
             setDashboardView(view);
             setActiveContentContext(null);
        }
    }
    
    const handleSelectInSpace = (selection) => {
        if (selection === 'overview') {
            setActiveContentContext({ spaceId: sidebarContext, boardId: 'overview' });
            setActiveSidebarSelectionId('overview');
        } else {
            handleNavigateToBoard(allBoardsMap.get(selection));
        }
    };

    const activeSpace = sidebarContext && sidebarContext !== 'recent' ? spacesData[sidebarContext] : null;

    const renderSidebarContent = () => {
        if (sidebarContext === 'recent') {
            return <RecentBoardsSidebar recentBoards={recentBoards} onSelectBoard={(boardId) => handleNavigateToBoard(allBoardsMap.get(boardId))} activeSidebarSelectionId={activeSidebarSelectionId} />;
        }
        if (activeSpace) {
            return <SpaceSidebar space={activeSpace} onSelectBoard={handleSelectInSpace} activeSidebarSelectionId={activeSidebarSelectionId} />;
        }
        return null;
    };

    const renderDashboardContent = () => {
        switch (dashboardView) {
            case 'recent':
                return <RecentContent recentBoards={recentBoards} onNavigateToBoard={(spaceId, boardId) => handleNavigateToBoard(allBoardsMap.get(boardId))} />;
            case 'home':
            default:
                return <DashboardContent onNavigateToBoard={handleNavigateToBoard} />;
        }
    }
    
    const [isSpaceMenuOpen, setIsSpaceMenuOpen] = useState(false);
    const menuRef = useRef(null);
     useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsSpaceMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);


    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            {currentView === 'dashboard' ? (
                <><DashboardSidebar onNavigateToSpace={handleNavigateToSpaceFromDashboard} onNavigateToRecent={handleDashboardNavigation} activeDashboardView={dashboardView} /><div className="flex-1 flex flex-col min-w-0">{renderDashboardContent()}</div></>
            ) : (
                <>
                    <SidebarContainer isExpanded={isSpaceSidebarExpanded} setIsExpanded={setIsSpaceSidebarExpanded}>
                         <div className="p-2 border-b h-16 flex items-center justify-between">
                            <div ref={menuRef} className="relative">
                               <div className="flex items-center rounded-md hover:bg-gray-200 group">
                                    <button onClick={handleNavigateHome} className="p-2 rounded-l-md">
                                        <HomeIcon />
                                    </button>
                                    <div className="h-5 w-px bg-gray-300"></div>
                                    <button onClick={() => setIsSpaceMenuOpen(prev => !prev)} className="p-2 rounded-r-md">
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5 ${isSpaceMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                                {isSpaceMenuOpen && <SpaceMenu onSwitchSidebar={handleSwitchSidebar} onShowRecent={handleShowRecentInSpace} closeMenu={() => setIsSpaceMenuOpen(false)} sidebarSpaceId={sidebarContext} activeContentSpaceId={activeContentContext?.spaceId} />}
                            </div>
                            <div className="flex items-center">
                               <button className="p-2 rounded-md hover:bg-gray-200"><SearchIcon /></button>
                               <button onClick={() => setIsSpaceSidebarExpanded(false)} className="p-2 rounded-md hover:bg-gray-200"><CloseIcon /></button>
                            </div>
                        </div>
                        {renderSidebarContent()}
                    </SidebarContainer>
                    <div className="flex-1 flex flex-col min-w-0">
                        <SpaceContent activeContentContext={activeContentContext} />
                    </div>
                </>
            )}
        </div>
    );
}

