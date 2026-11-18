'use client';
// 화면 그리기만 하는 파일이야.
// 상태 + 로직은 usePlanner.ts에, 계산은 helpers.ts에, 박스는 boxes.tsx에 있어.

import { DateBox, DdayBox, TasksBox, TimetableBox, PlannerBoard, MemoBox, btn, mini } from './boxes';
import { usePlanner } from './usePlanner';

export default function PlannerPage() {
  const p = usePlanner();

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', padding: 24, fontFamily: 'sans-serif' }}>
      {/* 맨 위: 제목 가운데, 날짜 선택 오른쪽 */}
      <div style={{ maxWidth: 900, margin: '0 auto 12px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        <div />
        <div style={{ fontSize: 26, fontWeight: 800, textAlign: 'center' }}>민주의 스터디플래너</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>날짜 선택</div>
          <input
            type="date"
            style={{ ...mini, fontSize: 13, padding: '6px 10px', fontFamily: 'inherit' }}
            value={p.viewDate}
            onChange={(e) => p.handleDateChange(e.target.value)}
          />
        </div>
      </div>

      {/* 2×2 그리드: 날짜 / D-day / 할 일 / 타임테이블 */}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
        <DateBox
          date={p.viewDate}
          weekday={p.weekday}
          comment={p.comment}
          setComment={p.setComment}
          theme={p.theme}
        />
        <DdayBox
          ddayText={p.ddayText}
          total={p.total}
          ddayDate={p.ddayDate}
          setDdayDate={p.setDdayDate}
          theme={p.theme}
          setTheme={p.setTheme}
        />
        <TasksBox
          title={p.title}
          setTitle={p.setTitle}
          subject={p.subject}
          setSubject={p.setSubject}
          editId={p.editId}
          onSubmit={p.submit}
          theme={p.theme}
          todos={p.dayTodos}
          onToggle={p.handleToggle}
          onEdit={p.handleEdit}
          onDelete={p.handleDelete}
        />
        <TimetableBox
          slots={p.slots}
          paint={p.paint}
          setPaint={p.setPaint}
          paintSlot={p.paintSlot}
          oneColor={p.oneColor}
          setOneColor={p.setOneColor}
          theme={p.theme}
          onReset={p.resetSlots}
        />
      </div>

      {/* 메모는 목록보다 위에 있어 */}
      <MemoBox memo={p.memo} setMemo={p.setMemo} />

      {/* 목록보기 켰을 때만 게시판 보여 */}
      {p.showList && <PlannerBoard rows={p.rows} onOpen={p.handleOpenFromList} />}

      {/* 맨 아래: 저장 / 목록보기 버튼 */}
      <div style={{ maxWidth: 900, margin: '12px auto 0', textAlign: 'center' }}>
        <button onClick={p.saveAll} style={{ ...btn, background: p.theme }}>
          플래너 저장
        </button>
        <button
          onClick={p.toggleList}
          style={{ ...btn, background: '#fff', color: p.theme, border: `2px solid ${p.theme}`, marginLeft: 8 }}
        >
          목록보기
        </button>
        <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{p.savedMsg}</span>
      </div>
    </div>
  );
}
