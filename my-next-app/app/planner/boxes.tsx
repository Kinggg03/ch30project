// 화면 박스들을 한 파일에 묶었어. 같이 쓰는 상수 + 스타일도 여기 있어.
import type { Todo } from '../../lib/api';

export const COLORS: Record<string, string> = { react: '#ff8fab', spring: '#7ec850', python: '#f9c74f', java: '#6ea8fe' };
export const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
export const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
export const THEMES = [{ name: '핑크', color: '#ff8fab' }, { name: '보라', color: '#b388eb' }, { name: '하늘', color: '#6ea8fe' }, { name: '민트', color: '#5ec4a6' }, { name: '오렌지', color: '#ff9f68' }];
export const box = { background: '#fff', border: '1px solid #f0d5d5', borderRadius: 12, padding: 16 } as const;
export const input = { borderRadius: 999, border: '1px solid #f0d5d5', padding: '9px 14px', outline: 'none' } as const;
export const btn = { background: '#ff8fab', color: '#fff', border: 'none', borderRadius: 999, padding: '9px 18px', cursor: 'pointer', fontWeight: 700 } as const;
export const mini = { border: '1px solid #f0d5d5', background: '#fff', borderRadius: 999, padding: '5px 11px', cursor: 'pointer', fontSize: 12 } as const;
export const colorOf = (name: string) => COLORS[name] ?? '#ccc';

// 1번 박스: 날짜 + 요일 + 명언
export function DateBox({ date, weekday, comment, setComment, theme }: { date: string; weekday: string; comment: string; setComment: (v: string) => void; theme: string }) {
  return (
    <div style={{ ...box, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div><b style={{ fontSize: 32 }}>{date}</b> <b style={{ fontSize: 32 }}>{weekday}</b></div>
      <p style={{ background: `${theme}33`, display: 'inline-block', padding: '2px 8px', borderRadius: 6, margin: '20px 0 0' }}>{comment}</p>
      <div style={{ display: 'flex', gap: 6, marginTop: 10, fontSize: 12, color: '#999', alignItems: 'center' }}><span>명언:</span><input style={{ ...input, padding: '6px 10px', flex: 1, minWidth: 0 }} value={comment} onChange={(e) => setComment(e.target.value)} /></div>
    </div>
  );
}

// 2번 박스: D-day + 총 시간 + 테마 고르기
export function DdayBox({ ddayText, total, ddayDate, setDdayDate, theme, setTheme }: { ddayText: string; total: string; ddayDate: string; setDdayDate: (v: string) => void; theme: string; setTheme: (v: string) => void }) {
  return (
    <div style={{ ...box, textAlign: 'right' }}>
      <b style={{ background: theme, color: '#fff', borderRadius: 6, padding: '2px 8px' }}>{ddayText}</b>
      <p style={{ fontSize: 28, margin: '8px 0 0' }}>{total}</p>
      <div style={{ display: 'flex', gap: 6, marginTop: 10, fontSize: 12, color: '#999', alignItems: 'center', justifyContent: 'flex-end' }}><span>D-day 날짜:</span><input type="date" style={{ ...input, padding: '6px 10px' }} value={ddayDate} onChange={(e) => setDdayDate(e.target.value)} /></div>
      <div style={{ display: 'flex', gap: 6, marginTop: 12, alignItems: 'center', justifyContent: 'flex-end' }}><span style={{ fontSize: 12, color: '#999' }}>테마:</span>
        {THEMES.map((t) => <button key={t.name} onClick={() => setTheme(t.color)} title={t.name} style={{ width: 22, height: 22, borderRadius: '50%', border: theme === t.color ? '2px solid #333' : '2px solid #fff', background: t.color, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />)}
        <input type="color" value={theme} onChange={(e) => setTheme(e.target.value)} style={{ border: 'none', background: 'none', cursor: 'pointer' }} />
      </div>
    </div>
  );
}

// 3번 박스: TASKS — 할 일 추가 + 목록
export function TasksBox({ title, setTitle, subject, setSubject, editId, onSubmit, theme, todos, onToggle, onEdit, onDelete }: {
  title: string; setTitle: (v: string) => void; subject: string; setSubject: (v: string) => void; editId: number | null;
  onSubmit: (e: React.FormEvent) => void; theme: string; todos: Todo[];
  onToggle: (id: number) => void; onEdit: (t: Todo) => void; onDelete: (id: number) => void;
}) {
  return (
    <div style={box}>
      <b>TASKS</b>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 6, flexWrap: 'nowrap', alignItems: 'center', marginTop: 10 }}><input style={{ ...input, flex: 2, minWidth: 0 }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="할 일" />
        <select style={{ ...input, flexShrink: 0 }} value={subject} onChange={(e) => setSubject(e.target.value)}>{Object.keys(COLORS).map((s) => <option key={s}>{s}</option>)}</select>
        <button style={{ ...btn, background: theme, flexShrink: 0 }}>{editId ? '수정 완료' : '추가'}</button></form>
      {todos.length === 0 && <p style={{ color: '#999' }}>할 일이 없어요. 백엔드(8080)가 켜져 있는지 확인해봐.</p>}
      {todos.map((t) => (
        <div key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fffafa', borderRadius: 12, padding: '10px 12px', marginTop: 8 }}>
          <button onClick={() => onToggle(t.id)} style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${theme}`, background: t.done ? theme : '#fff', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>{t.done ? 'V' : ''}</button>
          <span style={{ background: colorOf(t.subject), borderRadius: 999, padding: '3px 9px', fontSize: 12, color: '#fff', flexShrink: 0 }}>{t.subject}</span>
          <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#aaa' : '#333' }}>{t.title}</span>
          <button onClick={() => onEdit(t)} style={mini}>수정</button><button onClick={() => onDelete(t.id)} style={{ ...mini, color: '#e05252', borderColor: '#f5c6c6', background: '#fff5f5' }}>삭제</button>
        </div>
      ))}
    </div>
  );
}

// 4번 박스: TIMETABLE — 마우스를 누른 채로 드래그하면 한 번에 칠해져. 빈 칸에서 시작하면 칠하기, 찬 칸에서 시작하면 지우기.
export function TimetableBox({ slots, paint, setPaint, paintSlot, oneColor, setOneColor, theme, onReset }: {
  slots: (string | null)[]; paint: boolean | null; setPaint: (v: boolean | null) => void;
  paintSlot: (i: number, on: boolean) => void; oneColor: boolean; setOneColor: (v: boolean) => void;
  theme: string; onReset: () => void;
}) {
  return (
    <div style={{ ...box, userSelect: 'none' }} onMouseUp={() => setPaint(null)} onMouseLeave={() => setPaint(null)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b>TIMETABLE</b><div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><label style={{ fontSize: 12, color: '#999' }}><input type="checkbox" checked={oneColor} onChange={(e) => setOneColor(e.target.checked)} /> 한 가지 색으로</label><button onClick={onReset} style={mini}>Reset</button></div></div>
      {HOURS.map((h, hi) => (
        <div key={h} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}><span style={{ width: 30, fontSize: 12 }}>{h}시</span>
          <div style={{ flex: 1, display: 'flex', gap: 2 }}>
            {[0, 1, 2, 3, 4, 5].map((j) => { const i = hi * 6 + j; return <div key={j} onMouseDown={(e) => { e.preventDefault(); const on = !slots[i]; setPaint(on); paintSlot(i, on); }} onMouseEnter={() => { if (paint !== null) paintSlot(i, paint); }} style={{ flex: 1, height: 18, borderRadius: 4, cursor: 'pointer', background: slots[i] ? (oneColor ? theme : colorOf(slots[i]!)) : '#eee' }} />; })}
          </div>
        </div>
      ))}
    </div>
  );
}

// 게시판: 저장된 플래너 목록. 한 줄: 날짜 / 명언 / D-day / 할 일 개수 / 총 시간. 줄을 누르면 그날 플래너가 열려.
export type BoardRow = { d: string; comment: string; dday: string; n: number; total: string };

export function PlannerBoard({ rows, onOpen }: { rows: BoardRow[]; onOpen: (d: string) => void }) {
  return (
    <div style={{ ...box, maxWidth: 900, margin: '12px auto 0' }}><b>📅 플래너 목록</b>
      {rows.map((r) => <div key={r.d} onClick={() => onOpen(r.d)} style={{ display: 'flex', gap: 12, padding: '8px 4px', borderTop: '1px solid #f0d5d5', cursor: 'pointer' }}><span style={{ width: 100 }}>{r.d}</span><span style={{ flex: 1 }}>{r.comment}</span><span>{r.dday}</span><span>할 일 {r.n}개</span><span>{r.total}</span></div>)}
      {rows.length === 0 && <p style={{ color: '#999' }}>저장된 플래너가 없어요.</p>}
    </div>
  );
}

// 메모: 그날 간략 메모. 크게 한 칸, 저장 버튼 누르면 날짜별로 DB에 같이 저장돼.
export function MemoBox({ memo, setMemo }: { memo: string; setMemo: (v: string) => void }) {
  return (
    <div style={{ ...box, maxWidth: 900, margin: '12px auto 0' }}><b>📝 메모</b>
      <textarea style={{ width: '100%', minHeight: 120, border: '1px solid #f0d5d5', borderRadius: 12, padding: 12, marginTop: 10, outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="오늘 간략하게 메모해봐" />
    </div>
  );
}
