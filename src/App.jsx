import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutTemplate, Type, Info, Users, Download, Tags, Check, Sparkles, 
  Image as ImageIcon, Calendar, MapPin, LayoutGrid, Paintbrush, 
  BookOpen, Calculator, Languages, FlaskConical, Landmark, Globe, Palette, Music, Dumbbell, Code,
  Presentation, Lightbulb, School, Compass, Tent, Trophy, Flame, PartyPopper, Mic, Star, GraduationCap,
  Sunrise, Backpack, Flower, HeartHandshake, Sun, Moon, Leaf, Ghost, Target, Snowflake, Wine, CloudSnow,
  Waves, Plane, Umbrella, Cloud, X, Circle, Square, ArrowUpRight,
  AlignLeft, AlignCenter, AlignRight, Building, ChevronDown, FileText
} from 'lucide-react';

// 최신 캡처 라이브러리 (Tailwind v4 oklch 완벽 지원)
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

const COLOR_PALETTES = [
  { id: 'blue', name: '신뢰의 블루', bg: 'bg-gradient-to-br from-blue-600 to-indigo-900', isDarkText: false },
  { id: 'green', name: '안전의 그린', bg: 'bg-gradient-to-br from-emerald-600 to-teal-900', isDarkText: false },
  { id: 'purple', name: '혁신의 퍼플', bg: 'bg-gradient-to-br from-purple-600 to-fuchsia-900', isDarkText: false },
  { id: 'orange', name: '열정의 오렌지', bg: 'bg-gradient-to-br from-orange-500 to-red-800', isDarkText: false },
  { id: 'dark', name: '품격의 다크', bg: 'bg-gradient-to-br from-gray-800 to-black', isDarkText: false },
  { id: 'coral', name: '트렌디 코랄', bg: 'bg-gradient-to-br from-rose-400 to-orange-500', isDarkText: false },
  { id: 'cyber', name: '사이버 펑크', bg: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700', isDarkText: false },
  { id: 'pastel', name: '파스텔 드림', bg: 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200', isDarkText: true },
  { id: 'minimal', name: '미니멀 실버', bg: 'bg-gradient-to-br from-gray-100 to-gray-300', isDarkText: true },
  { id: 'sunset', name: '선셋 바이브', bg: 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600', isDarkText: false },
  { id: 'pure_white', name: '순백의 화이트', bg: 'bg-gradient-to-br from-slate-50 to-gray-200', isDarkText: true },
  { id: 'light_green', name: '싱그러운 연두', bg: 'bg-gradient-to-br from-lime-100 via-green-100 to-emerald-100', isDarkText: true },
  { id: 'light_yellow', name: '포근한 연노랑', bg: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100', isDarkText: true },
  { id: 'beige', name: '모던 베이지', bg: 'bg-gradient-to-br from-stone-200 to-stone-300', isDarkText: true },
  { id: 'ivory', name: '클래식 아이보리', bg: 'bg-gradient-to-br from-orange-50 to-amber-50', isDarkText: true },
  { id: 'navy', name: '미드나잇 네이비', bg: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950', isDarkText: false },
];

const GENERAL_THEMES = [
  { id: 'base', name: '기본', icon: LayoutGrid },
  { id: 'ocean', name: '바다', icon: Waves },
  { id: 'vacation', name: '휴가', icon: Plane },
  { id: 'circle', name: '동그라미', icon: Circle },
  { id: 'square', name: '네모', icon: Square },
  { id: 'arrow', name: '화살표', icon: ArrowUpRight },
  { id: 'star_shape', name: '별표', icon: Star },
];

const SUBJECT_THEMES = [
  { id: 'korean', name: '국어', icon: BookOpen },
  { id: 'math', name: '수학', icon: Calculator },
  { id: 'english', name: '언어', icon: Languages },
  { id: 'science', name: '과학', icon: FlaskConical },
  { id: 'history', name: '역사', icon: Landmark },
  { id: 'geography', name: '지리', icon: Globe },
  { id: 'art', name: '미술', icon: Palette },
  { id: 'music', name: '음악', icon: Music },
  { id: 'pe', name: '체육', icon: Dumbbell },
  { id: 'coding', name: '코딩', icon: Code },
];

const EVENT_THEMES = [
  { id: 'assembly', name: '총회', icon: Presentation },
  { id: 'training', name: '연수', icon: Lightbulb },
  { id: 'entrance', name: '입학식', icon: School },
  { id: 'orientation', name: '오리엔테이션', icon: Compass },
  { id: 'picnic', name: '소풍', icon: Tent },
  { id: 'sports_day', name: '체육대회', icon: Trophy },
  { id: 'retreat', name: '수련회', icon: Flame },
  { id: 'festival', name: '축제', icon: PartyPopper },
  { id: 'presentation', name: '발표회', icon: Mic },
  { id: 'graduation', name: '졸업식', icon: GraduationCap },
];

const SEASON_THEMES = [
  { id: 'lunar_new_year', name: '설날', icon: Sunrise },
  { id: 'new_semester', name: '새학기', icon: Backpack },
  { id: 'cherry_blossom', name: '벚꽃', icon: Flower },
  { id: 'family_month', name: '가정의달', icon: HeartHandshake },
  { id: 'summer_vacation', name: '여름', icon: Sun },
  { id: 'chuseok', name: '추석', icon: Moon },
  { id: 'autumn_leaves', name: '단풍', icon: Leaf },
  { id: 'halloween', name: '할로윈', icon: Ghost },
  { id: 'christmas', name: '크리스마스', icon: Snowflake },
  { id: 'year_end', name: '연말', icon: Wine },
  { id: 'winter_vacation', name: '겨울', icon: CloudSnow },
];

export default function App() {
  const bannerRef = useRef(null);
  const [title, setTitle] = useState('2026 미래 혁신 교육 및 청렴 선포식');
  const [date, setDate] = useState('2026. 10. 23.(금) 14:00');
  const [location, setLocation] = useState('교육청 본관 대강당');
  const [target, setTarget] = useState('관내 초·중·고 교원 및 교육 관계자');
  const [host, setHost] = useState('ㅇㅇ광역시교육청');
  
  const [titleSize, setTitleSize] = useState(32);
  const [dateSize, setDateSize] = useState(12);
  const [locationSize, setLocationSize] = useState(12);
  const [targetSize, setTargetSize] = useState(12);
  const [hostSize, setHostSize] = useState(12);

  const [titleAlign, setTitleAlign] = useState('left');
  const [dateAlign, setDateAlign] = useState('left');
  const [locationAlign, setLocationAlign] = useState('left');
  const [targetAlign, setTargetAlign] = useState('left');
  const [hostAlign, setHostAlign] = useState('right');

  const [selectedKeywords, setSelectedKeywords] = useState(['미래교육', '청렴', '혁신', '안전한 학교']);
  const [keywordInput, setKeywordInput] = useState('');
  
  const [activeTab, setActiveTab] = useState('info');
  const [currentColor, setCurrentColor] = useState(COLOR_PALETTES[0]);
  const [currentThemeId, setCurrentThemeId] = useState('assembly');
  const [toastMessage, setToastMessage] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg) => setToastMessage(msg);

  // 다운로드 처리 함수 (html-to-image 적용)
  const handleDownload = async (format) => {
    if (!bannerRef.current) return;
    
    setShowDownloadMenu(false);
    showToast(`${format.toUpperCase()} 저장을 시작합니다...`);

    try {
      const fileName = `banner_${Date.now()}`;
      
      // 화면 캡처 대상의 실제 크기 측정
      const width = bannerRef.current.offsetWidth;
      const height = bannerRef.current.offsetHeight;

      if (format === 'jpg') {
        // JPG 고해상도(pixelRatio: 2) 캡처
        const dataUrl = await htmlToImage.toJpeg(bannerRef.current, { 
          quality: 0.95, 
          pixelRatio: 2,
          backgroundColor: '#ffffff' // 투명 배경 방지
        });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.jpg`;
        link.click();
        showToast('JPG 이미지가 성공적으로 저장되었습니다.');
        
      } else if (format === 'pdf') {
        // PDF는 화질 손실 방지를 위해 PNG로 캡처
        const dataUrl = await htmlToImage.toPng(bannerRef.current, { 
          pixelRatio: 2 
        });
        
        // 배너의 비율에 맞게 PDF 용지 크기 자동 설정
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height] 
        });
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
        pdf.save(`${fileName}.pdf`);
        showToast('PDF 파일이 성공적으로 저장되었습니다.');
      }
    } catch (error) {
      console.error('Download error:', error);
      showToast('저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
    }
  };

  const handleAddCustomKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed) return;
    if (selectedKeywords.includes(trimmed)) {
      showToast('이미 추가된 키워드입니다.');
      return;
    }
    if (selectedKeywords.length >= 5) {
      showToast('키워드는 최대 5개까지만 추가할 수 있습니다.');
      return;
    }
    setSelectedKeywords([...selectedKeywords, trimmed]);
    setKeywordInput('');
  };

  const removeKeyword = (keywordToRemove) => {
    setSelectedKeywords(selectedKeywords.filter(k => k !== keywordToRemove));
  };

  const titleColorCls = currentColor.isDarkText ? 'text-gray-900' : 'text-white';
  const descColorCls = currentColor.isDarkText ? 'text-gray-800' : 'text-white/90';
  const badgeCls = currentColor.isDarkText ? 'bg-gray-900/10 border-gray-900/20 text-gray-800' : 'bg-white/20 border-white/30 text-white';
  const iconColorCls = currentColor.isDarkText ? 'text-gray-900' : 'text-white';

  const alignClassMap = { left: 'justify-start', center: 'justify-center', right: 'justify-end' };
  const textAlignMap = { left: 'text-left', center: 'text-center', right: 'text-right' };

  const renderAlignButtons = (currentAlign, setAlign) => (
    <div className="flex bg-gray-100 p-0.5 rounded-md">
      <button onClick={() => setAlign('left')} className={`p-1 rounded ${currentAlign === 'left' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200'} transition-colors`}><AlignLeft className="w-3.5 h-3.5" /></button>
      <button onClick={() => setAlign('center')} className={`p-1 rounded ${currentAlign === 'center' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200'} transition-colors`}><AlignCenter className="w-3.5 h-3.5" /></button>
      <button onClick={() => setAlign('right')} className={`p-1 rounded ${currentAlign === 'right' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200'} transition-colors`}><AlignRight className="w-3.5 h-3.5" /></button>
    </div>
  );

  const renderSizeInput = (currentSize, setSize, min = 10, max = 80) => (
    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
      <span className="text-[10px] text-gray-500 font-medium">크기</span>
      <input type="number" value={currentSize} onChange={(e) => setSize(Number(e.target.value))} className="w-10 bg-white border border-gray-200 rounded px-1 py-0.5 text-xs text-center focus:outline-none focus:border-blue-400" min={min} max={max} />
      <span className="text-[10px] text-gray-500">pt</span>
    </div>
  );

  const renderThemeDecorations = () => {
    const op10 = 'opacity-10';
    const op20 = 'opacity-20';
    const op5 = 'opacity-5';

    const ALL_THEMES = [...GENERAL_THEMES, ...SUBJECT_THEMES, ...EVENT_THEMES, ...SEASON_THEMES];
    const currentTheme = ALL_THEMES.find(t => t.id === currentThemeId) || GENERAL_THEMES[0];
    const ActiveIcon = currentTheme.icon;

    return (
      <>
        <ActiveIcon className={`absolute top-10 right-16 w-36 h-36 ${iconColorCls} ${op20} -rotate-12 transition-all duration-500`} />
        <ActiveIcon className={`absolute bottom-24 right-40 w-16 h-16 ${iconColorCls} ${op10} rotate-12 transition-all duration-500`} />
        <ActiveIcon className={`absolute -bottom-20 -left-16 w-80 h-80 ${iconColorCls} ${op5} -rotate-45 blur-sm transition-all duration-500`} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            행사 배너 메이커
          </h1>
          <p className="text-gray-500 text-sm mt-1">교육 및 공공기관 행사를 위한 세련된 배너를 쉽게 제작하세요.</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            다운로드
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
          </button>

          {showDownloadMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleDownload('pdf')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left border-b border-gray-50"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>PDF 파일 (.pdf)</span>
                </button>
                <button
                  onClick={() => handleDownload('jpg')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span>JPG 이미지 (.jpg)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/50">
              <button onClick={() => setActiveTab('info')} className={`flex-1 min-w-[80px] py-3.5 text-sm font-medium flex items-center justify-center gap-1.5 ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500'}`}><Info className="w-4 h-4" /> 정보</button>
              <button onClick={() => setActiveTab('tags')} className={`flex-1 min-w-[80px] py-3.5 text-sm font-medium flex items-center justify-center gap-1.5 ${activeTab === 'tags' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500'}`}><Tags className="w-4 h-4" /> 키워드</button>
              <button onClick={() => setActiveTab('theme')} className={`flex-1 min-w-[80px] py-3.5 text-sm font-medium flex items-center justify-center gap-1.5 ${activeTab === 'theme' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500'}`}><LayoutGrid className="w-4 h-4" /> 테마</button>
            </div>

            <div className="p-6 h-[600px] overflow-y-auto">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2"><label className="text-sm font-semibold">행사 제목</label><div className="flex gap-2">{renderAlignButtons(titleAlign, setTitleAlign)}{renderSizeInput(titleSize, setTitleSize)}</div></div>
                    <textarea rows={2} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><label className="text-sm font-semibold">행사 일시</label><div className="flex gap-2">{renderAlignButtons(dateAlign, setDateAlign)}{renderSizeInput(dateSize, setDateSize)}</div></div>
                    <textarea rows={2} value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><label className="text-sm font-semibold">행사 장소</label><div className="flex gap-2">{renderAlignButtons(locationAlign, setLocationAlign)}{renderSizeInput(locationSize, setLocationSize)}</div></div>
                    <textarea rows={2} value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><label className="text-sm font-semibold">참석 대상</label><div className="flex gap-2">{renderAlignButtons(targetAlign, setTargetAlign)}{renderSizeInput(targetSize, setTargetSize)}</div></div>
                    <textarea rows={2} value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between mb-2 mt-2"><label className="text-sm font-semibold">주최기관</label><div className="flex gap-2">{renderAlignButtons(hostAlign, setHostAlign)}{renderSizeInput(hostSize, setHostSize)}</div></div>
                    <textarea rows={2} value={host} onChange={(e) => setHost(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              )}
              {activeTab === 'tags' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCustomKeyword()} placeholder="키워드 입력" className="flex-1 px-4 py-2 border rounded-lg" />
                    <button onClick={handleAddCustomKeyword} className="px-4 py-2 bg-blue-600 text-white rounded-lg">추가</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedKeywords.map((kw, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
                        <span>{kw}</span>
                        <button onClick={() => removeKeyword(kw)}><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold block mb-3">테마 선택</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[...GENERAL_THEMES, ...SUBJECT_THEMES, ...EVENT_THEMES, ...SEASON_THEMES].map((t) => (
                        <button key={t.id} onClick={() => setCurrentThemeId(t.id)} className={`flex flex-col items-center p-2 rounded-xl border-2 ${currentThemeId === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                          <t.icon className="w-5 h-5 mb-1" />
                          <span className="text-[10px]">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <label className="text-sm font-bold block mb-3">컬러 팔레트</label>
                    <div className="grid grid-cols-2 gap-2">
                      {COLOR_PALETTES.map((color) => (
                        <button key={color.id} onClick={() => setCurrentColor(color)} className={`flex items-center gap-2 p-2 rounded-xl border-2 ${currentColor.id === color.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                          <div className={`w-4 h-4 rounded-full ${color.bg}`} />
                          <span className="text-xs truncate">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="sticky top-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Live Preview</h2>
            
            {/* 캡처할 대상 (bannerRef 연결) */}
            <div ref={bannerRef} className={`relative w-full aspect-[16/9] md:aspect-[4/3] rounded-2xl shadow-xl overflow-hidden ${currentColor.bg} transition-all duration-700`}>
              <div className="pointer-events-none">{renderThemeDecorations()}</div>
              <div className="relative h-full flex flex-col justify-between p-8 md:p-12 z-10">
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedKeywords.map((kw, idx) => (
                    <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider backdrop-blur-md ${badgeCls}`}>{kw}</span>
                  ))}
                </div>
                <div className="flex-grow flex flex-col justify-center w-full">
                  <h1 className={`font-extrabold leading-tight mb-4 whitespace-pre-wrap ${titleColorCls} ${textAlignMap[titleAlign]}`} style={{ fontSize: `${titleSize}pt` }}>{title}</h1>
                  <div className="flex flex-col gap-2.5 mt-2">
                    <div className={`flex items-start gap-2.5 font-medium ${descColorCls} ${alignClassMap[dateAlign]}`} style={{ fontSize: `${dateSize}pt` }}>
                      <Calendar className="w-6 h-6 opacity-80 shrink-0" /><span className={textAlignMap[dateAlign]}>{date}</span>
                    </div>
                    <div className={`flex items-start gap-2.5 font-medium ${descColorCls} ${alignClassMap[locationAlign]}`} style={{ fontSize: `${locationSize}pt` }}>
                      <MapPin className="w-6 h-6 opacity-80 shrink-0" /><span className={textAlignMap[locationAlign]}>{location}</span>
                    </div>
                  </div>
                </div>
                <div className={`mt-8 pt-6 border-t flex flex-row items-start justify-between gap-4 ${currentColor.isDarkText ? 'border-gray-900/20' : 'border-white/20'}`}>
                  <div className={`w-[70%] flex items-start gap-2 font-medium ${descColorCls} ${alignClassMap[targetAlign]}`} style={{ fontSize: `${targetSize}pt` }}>
                    <Users className="w-5 h-5 opacity-80 shrink-0" /><span className={textAlignMap[targetAlign]}>{target}</span>
                  </div>
                  <div className={`w-[30%] flex items-start gap-2 font-extrabold ${titleColorCls} ${alignClassMap[hostAlign]}`} style={{ fontSize: `${hostSize}pt` }}>
                    <span className={`w-full ${textAlignMap[hostAlign]}`}>{host}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">실제 다운로드 시 위 영역이 파일로 저장됩니다.</p>
          </div>
        </div>
      </main>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <Info className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}